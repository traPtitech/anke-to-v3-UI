<script lang="ts" setup>
import ExplorerFilterTabRow from './explorer-filter-tab-row.vue';
import ExplorerFilterToolbar from './explorer-filter-toolbar.vue';
import type { ExplorerFilterPayload, TabKey } from './filter-types';
import { useExplorerFilterPanel } from './use-explorer-filter-panel';

const ExplorerAdvancedFilterGrid = defineAsyncComponent(() => import('./explorer-advanced-filter-grid.vue'));

const activeFilterAnimations = new WeakMap<HTMLElement, Animation>();
const expandedFilterHeights = new WeakMap<HTMLElement, number>();
const interruptedFilterStates = new WeakMap<HTMLElement, { height: number; opacity: number }>();

const readFilterVisualState = (element: HTMLElement) => ({
  height: element.getBoundingClientRect().height,
  opacity: Number.parseFloat(getComputedStyle(element).opacity),
});

const cancelAdvancedFilter = (element: Element) => {
  if (!(element instanceof HTMLElement)) return;

  interruptedFilterStates.set(element, readFilterVisualState(element));
  const animation = activeFilterAnimations.get(element);
  if (animation) {
    activeFilterAnimations.delete(element);
    animation.cancel();
  }
  element.style.removeProperty('overflow');
  element.style.removeProperty('will-change');
};

const animateAdvancedFilter = (element: Element, opening: boolean, done: () => void) => {
  if (!(element instanceof HTMLElement) || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    done();
    return;
  }

  const runningAnimation = activeFilterAnimations.get(element);
  const interruptedState = interruptedFilterStates.get(element) ?? (runningAnimation ? readFilterVisualState(element) : undefined);
  interruptedFilterStates.delete(element);
  if (runningAnimation) {
    activeFilterAnimations.delete(element);
    runningAnimation.cancel();
  }

  const measuredHeight = element.getBoundingClientRect().height;
  if (opening) {
    expandedFilterHeights.set(element, Math.max(expandedFilterHeights.get(element) ?? 0, measuredHeight));
  }
  const naturalHeight = expandedFilterHeights.get(element) ?? measuredHeight;
  const fromHeight = interruptedState?.height ?? (opening ? 0 : naturalHeight);
  const fromOpacity = interruptedState?.opacity ?? (opening ? 0 : 1);
  const toHeight = opening ? naturalHeight : 0;
  const distanceRatio = Math.min(1, Math.abs(toHeight - fromHeight) / Math.max(naturalHeight, 1));
  element.style.overflow = 'hidden';
  element.style.willChange = 'height, opacity';

  const animation = element.animate(
    [
      { height: `${fromHeight}px`, opacity: fromOpacity },
      { height: `${toHeight}px`, opacity: opening ? 1 : 0 },
    ],
    {
      duration: Math.max(80, Math.round((opening ? 220 : 180) * distanceRatio)),
      easing: opening ? 'cubic-bezier(0.2, 0, 0, 1)' : 'cubic-bezier(0.4, 0, 1, 1)',
    },
  );

  activeFilterAnimations.set(element, animation);

  const finish = () => {
    if (activeFilterAnimations.get(element) === animation) {
      activeFilterAnimations.delete(element);
      element.style.removeProperty('overflow');
      element.style.removeProperty('will-change');
    }
    done();
  };

  animation.addEventListener('finish', finish, { once: true });
  animation.addEventListener('cancel', finish, { once: true });
};

const enterAdvancedFilter = (element: Element, done: () => void) => {
  animateAdvancedFilter(element, true, done);
};

const leaveAdvancedFilter = (element: Element, done: () => void) => {
  animateAdvancedFilter(element, false, done);
};

const advancedFilterId = useId();

const props = withDefaults(
  defineProps<{
    tabCounts?: Partial<Record<TabKey, number | string>>;
    tabCountsLoading?: boolean;
  }>(),
  {
    tabCounts: () => ({}),
    tabCountsLoading: false,
  },
);

const emit = defineEmits<{
  change: [payload: ExplorerFilterPayload];
}>();

const {
  tabs,
  isFilterExpanded,
  mobileSearchText,
  sortMenuItems,
  sortMenuLabel,
  onlyActiveDue,
  advancedFilterState,
  selectedTab,
  selectTab,
  tabCount,
  isSortMenuItemSelected,
} = useExplorerFilterPanel({
  tabCounts: toRef(props, 'tabCounts'),
  tabCountsLoading: toRef(props, 'tabCountsLoading'),
  onChange: (payload) => {
    emit('change', payload);
  },
});
</script>

<template>
  <div class="explorer-filter-panel">
    <ExplorerFilterTabRow :tabs="tabs" :selected-tab="selectedTab" :tab-count="tabCount" @select-tab="selectTab" />

    <section class="filter-shell">
      <ExplorerFilterToolbar
        :sort-menu-label="sortMenuLabel"
        :sort-menu-items="sortMenuItems"
        :is-sort-menu-item-selected="isSortMenuItemSelected"
        :only-active-due="onlyActiveDue"
        :is-filter-expanded="isFilterExpanded"
        :advanced-filter-id="advancedFilterId"
        @update:only-active-due="onlyActiveDue = $event"
        @toggle-filter-expanded="isFilterExpanded = !isFilterExpanded"
      />

      <Transition
        :css="false"
        @enter="enterAdvancedFilter"
        @enter-cancelled="cancelAdvancedFilter"
        @leave="leaveAdvancedFilter"
        @leave-cancelled="cancelAdvancedFilter"
      >
        <ExplorerAdvancedFilterGrid
          v-if="isFilterExpanded"
          :id="advancedFilterId"
          v-model:advanced-filter-state="advancedFilterState"
          v-model:search="mobileSearchText"
        />
      </Transition>
    </section>
  </div>
</template>

<style scoped lang="scss">
.explorer-filter-panel {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding-top: 8px;
}

.filter-shell {
  border: 1px solid var(--p-surface-300);
  border-radius: var(--p-border-radius-md);
  background-color: var(--p-surface-0);
  overflow: visible;
}

@media screen and (max-width: 560px) {
  .explorer-filter-panel {
    gap: 8px;
  }
}
</style>
