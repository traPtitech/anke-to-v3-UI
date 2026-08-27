<script lang="ts" setup>
import ExplorerFilterTabRow from './explorer-filter-tab-row.vue';
import ExplorerFilterToolbar from './explorer-filter-toolbar.vue';
import type { ExplorerFilterPayload, TabKey } from './filter-types';
import { useExplorerFilterPanel } from './use-explorer-filter-panel';

const ExplorerAdvancedFilterGrid = defineAsyncComponent(() => import('./explorer-advanced-filter-grid.vue'));

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
        @update:only-active-due="onlyActiveDue = $event"
        @toggle-filter-expanded="isFilterExpanded = !isFilterExpanded"
      />

      <Transition name="advanced-filter">
        <ExplorerAdvancedFilterGrid
          v-if="isFilterExpanded"
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
  overflow: hidden;
}

.advanced-filter-enter-active,
.advanced-filter-leave-active {
  transition: opacity 0.12s ease-out;
}

.advanced-filter-enter-from,
.advanced-filter-leave-to {
  opacity: 0;
}

@media screen and (max-width: 560px) {
  .explorer-filter-panel {
    gap: 8px;
  }
}
</style>
