<script setup lang="ts">
import type { RouteLocationRaw } from 'vue-router';

const props = withDefaults(
  defineProps<{
    to: RouteLocationRaw;
    variant?: 'primary' | 'secondary' | 'ghost';
    size?: 'md' | 'sm';
    disabled?: boolean;
    title?: string;
    block?: boolean;
  }>(),
  {
    variant: 'secondary',
    size: 'md',
    disabled: false,
    block: false,
  },
);

const severity = computed(() =>
  props.variant === 'primary' ? 'primary' : 'secondary',
);

const buttonVariant = computed(() => {
  if (props.variant === 'secondary') {
    return 'outlined';
  }

  if (props.variant === 'ghost') {
    return 'text';
  }

  return undefined;
});

const handleClick = (event: MouseEvent) => {
  if (!props.disabled) {
    return;
  }

  event.preventDefault();
  event.stopPropagation();
};
</script>

<template>
  <Button
    v-slot="slotProps"
    as-child
    :severity="severity"
    :variant="buttonVariant"
    :size="props.size === 'sm' ? 'small' : undefined"
    :disabled="props.disabled"
    :class="{ 'button-link-block': props.block }"
    :pt="{ root: { title: props.title } }"
  >
    <NuxtLink
      v-bind="slotProps"
      :to="props.to"
      class="button-link-anchor"
      :aria-disabled="props.disabled ? 'true' : undefined"
      :tabindex="props.disabled ? -1 : undefined"
      @click="handleClick"
    >
      <slot />
    </NuxtLink>
  </Button>
</template>

<style lang="scss" scoped>
.button-link-anchor {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  text-decoration: none;
}

.button-link-anchor[aria-disabled='true'] {
  pointer-events: none;
  cursor: not-allowed;
  opacity: 1;
}

.button-link-anchor.p-button[aria-disabled='true'] {
  background-color: var(--p-surface-100);
  border-color: var(--p-surface-300);
  color: var(--p-text-secondary);
}

.button-link-anchor.p-button.p-button-primary[aria-disabled='true'] {
  background-color: color-mix(
    in srgb,
    var(--p-primary-500) 18%,
    var(--p-surface-0)
  );
  border-color: color-mix(
    in srgb,
    var(--p-primary-500) 28%,
    var(--p-surface-0)
  );
  color: color-mix(in srgb, var(--p-primary-700) 55%, var(--p-surface-0));
}

.button-link-anchor.p-button.p-button-outlined[aria-disabled='true'],
.button-link-anchor.p-button.p-button-text[aria-disabled='true'] {
  background-color: var(--p-surface-100);
  border-color: var(--p-surface-300);
  color: var(--p-text-muted-color);
}

.button-link-block {
  width: 100%;
  justify-content: center;
}
</style>
