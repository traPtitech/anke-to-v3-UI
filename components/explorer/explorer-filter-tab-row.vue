<script setup lang="ts">
import type { ExplorerTabItem, TabKey } from './filter-types';

const props = defineProps<{
  tabs: ExplorerTabItem[];
  selectedTab: TabKey | null;
  tabCount: (tab: TabKey) => number;
}>();

const emit = defineEmits<{
  selectTab: [tab: TabKey];
}>();
</script>

<template>
  <div class="tab-row">
    <button
      v-for="tab in props.tabs"
      :key="tab.key"
      type="button"
      class="tab-button"
      :class="{ active: props.selectedTab === tab.key }"
      @click="emit('selectTab', tab.key)"
    >
      {{ tab.label }}
      <span class="tab-count">({{ props.tabCount(tab.key) }})</span>
    </button>
  </div>
</template>

<style scoped lang="scss">
.tab-row {
  display: flex;
  flex-wrap: nowrap;
  align-items: center;
  gap: 8px;
  overflow-x: auto;
  border-bottom: 1px solid var(--p-surface-300);
  padding: 10px 0;
  background-color: var(--p-surface-0);
}

.tab-button {
  flex: 0 0 auto;
  border: none;
  border-radius: 16px;
  background-color: var(--p-surface-100);
  color: var(--p-text-color);
  font-weight: 700;
  line-height: 1;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 10px 14px;
}

.tab-button.active {
  background-color: color-mix(in srgb, variables.$color-primary 15%, white);
  color: variables.$color-primary;
}

.tab-count {
  color: var(--p-text-secondary);
}

@media screen and (max-width: 560px) {
  .tab-row {
    padding: 8px 0;
  }

  .tab-button {
    padding: 8px 12px;
  }
}
</style>
