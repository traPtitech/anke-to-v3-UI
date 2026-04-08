<script setup lang="ts">
import ChipSelectRow from '~/components/ui/chip-select-row.vue';
import type { ExplorerTabItem, TabKey } from './filter-types';

const props = defineProps<{
  tabs: ExplorerTabItem[];
  selectedTab: TabKey | null;
  tabCount: (tab: TabKey) => number | string;
}>();

const emit = defineEmits<{
  selectTab: [tab: TabKey];
}>();

const tabChipItems = computed(() =>
  props.tabs.map((tab) => ({
    key: tab.key,
    label: tab.label,
    count: props.tabCount(tab.key),
  })),
);

const handleSelectTab = (key: string) => {
  emit('selectTab', key as TabKey);
};
</script>

<template>
  <div class="tab-row">
    <ChipSelectRow
      :items="tabChipItems"
      :selected-key="props.selectedTab"
      :wrap="false"
      @select="handleSelectTab"
    />
  </div>
</template>

<style scoped lang="scss">
.tab-row {
  padding: 10px 0;
  background-color: var(--p-surface-0);
}

@media screen and (max-width: 560px) {
  .tab-row {
    padding: 8px 0;
  }
}
</style>
