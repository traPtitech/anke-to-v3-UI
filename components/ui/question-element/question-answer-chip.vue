<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    selected?: boolean;
    showCheck?: boolean;
  }>(),
  {
    selected: true,
    showCheck: true,
  },
);
</script>

<template>
  <span
    class="answer-chip"
    :class="{ 'answer-chip-unselected': !props.selected }"
  >
    <Icon
      v-if="props.selected && props.showCheck"
      name="mdi:check-circle"
      size="14px"
    />
    <slot />
  </span>
</template>

<style lang="scss" scoped>
.answer-chip {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 12px;
  border-radius: 999px;
  font-size: 13px;
  font-weight: 500;
  background-color: var(--p-primary-50);
  color: var(--p-primary-700);
  border: 1px solid var(--p-primary-200);
  transition: all 0.2s ease;
}

.answer-chip-unselected {
  background-color: transparent;
  color: var(--p-text-muted-color);
  border: 1px dashed var(--p-surface-300);
}
</style>
