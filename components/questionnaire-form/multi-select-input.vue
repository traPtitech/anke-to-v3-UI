<script lang="ts" setup>
import type {
  MultiSelectAllChangeEvent,
  MultiSelectChangeEvent,
} from 'primevue/multiselect';

type Item = {
  label: string;
  value: string;
};

const props = defineProps<{
  options: Item[];
  placeholder?: string;
}>();

const items = defineModel<string[]>({ required: true });

const isAllSelected = ref(items.value.length === props.options.length);

const onSelectAllChange = (event: MultiSelectAllChangeEvent) => {
  items.value = event.checked ? props.options.map(({ value }) => value) : [];
  isAllSelected.value = event.checked;
};
const onChange = (event: MultiSelectChangeEvent) => {
  isAllSelected.value = event.value.length === items.value.length;
};
</script>

<template>
  <MultiSelect
    v-model="items"
    :options="options"
    option-label="label"
    option-value="value"
    filter
    :select-all="isAllSelected"
    :virtual-scroller-options="{ itemSize: 50 }"
    :placeholder="placeholder"
    scroll-height="320px"
    @selectall-change="onSelectAllChange($event)"
    @change="onChange($event)"
  >
    <template #option="{ option, index }">
      <slot name="option" :option="option" :index="index" />
    </template>
  </MultiSelect>
</template>

<style lang="scss" scoped></style>
