<script setup lang="ts">
export type ChipSelectItem = {
  key: string;
  label: string;
  count?: number | string;
};

const props = withDefaults(
  defineProps<{
    items: ChipSelectItem[];
    selectedKey: string | null;
    wrap?: boolean;
  }>(),
  {
    wrap: true,
  },
);

const emit = defineEmits<{
  select: [key: string];
}>();
</script>

<template>
  <div class="chip-row" :class="{ nowrap: !props.wrap }">
    <button
      v-for="item in props.items"
      :key="item.key"
      type="button"
      class="chip-button"
      :class="{ active: props.selectedKey === item.key }"
      :aria-pressed="props.selectedKey === item.key"
      @click="emit('select', item.key)"
    >
      {{ item.label }}
      <span v-if="item.count !== undefined" class="chip-count">
        ({{ item.count }})
      </span>
    </button>
  </div>
</template>

<style scoped lang="scss">
.chip-row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
}

.chip-row.nowrap {
  flex-wrap: nowrap;
  overflow-x: auto;
}

.chip-button {
  appearance: none;
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
  justify-content: center;
  white-space: nowrap;
  flex: 1;
  gap: 4px;
  padding: 10px 14px;
}

.chip-button.active {
  background-color: color-mix(in srgb, var(--p-primary-color) 15%, white);
  color: var(--p-primary-color);
}

.chip-button:focus-visible {
  outline: 2px solid color-mix(in srgb, var(--p-primary-color) 45%, white);
  outline-offset: 2px;
}

.chip-count {
  color: var(--p-text-secondary);
}

@media screen and (max-width: 560px) {
  .chip-button {
    padding: 8px 12px;
  }
}
</style>
