<script lang="ts" setup>
import ExplorerAdvancedFilterGrid from './explorer-advanced-filter-grid.vue';
import ExplorerFilterTabRow from './explorer-filter-tab-row.vue';
import ExplorerFilterToolbar from './explorer-filter-toolbar.vue';
import type { ExplorerFilterPayload, TabKey } from './filter-types';
import { useExplorerFilterPanel } from './use-explorer-filter-panel';

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
    <ExplorerFilterTabRow
      :tabs="tabs"
      :selected-tab="selectedTab"
      :tab-count="tabCount"
      @select-tab="selectTab"
    />

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

      <Accordion
        :value="isFilterExpanded ? 'advanced' : undefined"
        class="advanced-filter-accordion"
      >
        <AccordionPanel value="advanced">
          <AccordionHeader class="advanced-filter-hidden-header">
            高度なフィルタ
          </AccordionHeader>
          <AccordionContent>
            <ExplorerAdvancedFilterGrid
              v-model:advanced-filter-state="advancedFilterState"
            />
          </AccordionContent>
        </AccordionPanel>
      </Accordion>
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

:deep(.advanced-filter-accordion .p-accordionpanel),
:deep(.advanced-filter-accordion .p-accordioncontent) {
  border: none;
}

:deep(.advanced-filter-accordion .p-accordioncontent) {
  transition: max-height 0.12s ease-out;
}

:deep(.advanced-filter-accordion .p-accordionheader) {
  display: none;
}

:deep(.advanced-filter-accordion .p-accordioncontent-content) {
  padding: 0;
}

.advanced-filter-hidden-header {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

@media screen and (max-width: 560px) {
  .explorer-filter-panel {
    gap: 8px;
  }
}
</style>
