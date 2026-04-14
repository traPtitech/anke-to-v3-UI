<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    highlighted?: boolean;
    tone?: 'neutral' | 'primary';
    size?: 'sm' | 'md';
  }>(),
  {
    highlighted: false,
    tone: 'neutral',
    size: 'sm',
  },
);
</script>

<template>
  <span
    class="ui-chip"
    :class="[
      `ui-chip--${props.tone}`,
      `ui-chip--${props.size}`,
      { 'ui-chip--highlighted': props.highlighted },
    ]"
  >
    <slot />
  </span>
</template>

<style lang="scss" scoped>
.ui-chip {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  border-radius: 999px;
  line-height: 1.4;
  white-space: nowrap;
  border: 1px solid transparent;
  font-weight: 500;
}

.ui-chip--sm {
  padding: 3px 10px 3px 6px;
  font-size: 13px;
}

.ui-chip--md {
  padding: 6px 12px 6px 8px;
  font-size: 14px;
}

.ui-chip--neutral {
  background-color: var(--p-surface-100);
  color: var(--p-text-color);
}

.ui-chip--primary,
.ui-chip--highlighted {
  background-color: var(--p-primary-50);
  color: var(--p-primary-700);
  border-color: var(--p-primary-200);
}
</style>
