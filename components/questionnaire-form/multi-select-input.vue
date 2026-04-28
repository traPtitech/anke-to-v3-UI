<script lang="ts" setup>
import type { MultiSelectAllChangeEvent, MultiSelectChangeEvent, MultiSelectFilterEvent } from 'primevue/multiselect';

type Item = {
  label: string;
  value: string;
};

const props = defineProps<{
  options: Item[];
  placeholder?: string;
}>();

const items = defineModel<string[]>({ required: true });

const filterValue = ref('');

const filteredOptionValues = computed(() => {
  const keyword = filterValue.value.trim().toLowerCase();
  if (keyword === '') {
    return props.options.map(({ value }) => value);
  }

  return props.options
    .filter(({ label, value }) => {
      const normalizedLabel = label.toLowerCase();
      const normalizedValue = value.toLowerCase();
      return normalizedLabel.includes(keyword) || normalizedValue.includes(keyword);
    })
    .map(({ value }) => value);
});

const isAllSelected = computed(() => {
  if (filteredOptionValues.value.length === 0) return false;
  return filteredOptionValues.value.every((value) => items.value.includes(value));
});

const onSelectAllChange = (event: MultiSelectAllChangeEvent) => {
  const targetValues = new Set(filteredOptionValues.value);

  if (event.checked) {
    items.value = Array.from(new Set([...items.value, ...targetValues]));
    return;
  }

  items.value = items.value.filter((value) => !targetValues.has(value));
};

const onChange = (event: MultiSelectChangeEvent) => {
  items.value = event.value;
};

const onFilter = (event: MultiSelectFilterEvent) => {
  filterValue.value = event.value;
};
</script>

<template>
  <MultiSelect
    v-model="items"
    class="stable-height-multi-select"
    :options="options"
    option-label="label"
    option-value="value"
    display="chip"
    filter
    :select-all="isAllSelected"
    :virtual-scroller-options="{ itemSize: 50 }"
    :placeholder="placeholder"
    scroll-height="320px"
    @selectall-change="onSelectAllChange($event)"
    @change="onChange($event)"
    @filter="onFilter($event)"
  >
    <template #option="{ option, index }">
      <slot name="option" :option="option" :index="index" />
    </template>
  </MultiSelect>
</template>

<style lang="scss" scoped>
.stable-height-multi-select {
  :deep(.p-multiselect) {
    max-height: 40px;
  }

  :deep(.p-multiselect-label-container) {
    max-height: 40px;
    display: flex;
    align-items: center;
  }

  :deep(.p-multiselect-label) {
    max-height: 40px;
    display: flex;
    align-items: center;
    gap: 4px;
  }
}
</style>
