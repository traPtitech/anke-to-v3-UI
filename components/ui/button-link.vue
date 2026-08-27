<script setup lang="ts">
import type { RouteLocationRaw } from 'vue-router';

defineOptions({ inheritAttrs: false });

const props = withDefaults(
  defineProps<{
    to: RouteLocationRaw;
    variant?: 'primary' | 'secondary' | 'ghost';
    size?: 'md' | 'sm';
    disabled?: boolean;
    title?: string;
  }>(),
  {
    variant: 'secondary',
    size: 'md',
    disabled: false,
  },
);

const handleClick = (event: MouseEvent) => {
  if (!props.disabled) {
    return;
  }

  event.preventDefault();
  event.stopPropagation();
};

</script>

<template>
  <NuxtLink
    v-bind="$attrs"
    :to="props.to"
    :title="props.title"
    :class="['button-link-anchor', `button-link-${props.variant}`, `button-link-${props.size}`, $attrs.class]"
    :aria-disabled="props.disabled ? 'true' : undefined"
    :tabindex="props.disabled ? -1 : undefined"
    @click="handleClick"
  >
    <slot />
  </NuxtLink>
</template>

<style lang="scss" scoped>
.button-link-anchor {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  min-height: 40px;
  padding: 0.625rem 1rem;
  border: 1px solid transparent;
  border-radius: var(--p-border-radius-md, 6px);
  font-weight: 600;
  line-height: 1;
  text-decoration: none;
  transition:
    background-color 0.18s ease,
    border-color 0.18s ease,
    color 0.18s ease,
    box-shadow 0.18s ease;
}

.button-link-primary {
  border-color: var(--app-primary-500);
  background-color: var(--app-primary-500);
  color: white;
}

.button-link-primary:hover {
  border-color: var(--app-primary-600);
  background-color: var(--app-primary-600);
}

.button-link-secondary {
  border-color: var(--app-secondary-border);
  background-color: transparent;
  color: var(--app-secondary-text);
}

.button-link-secondary:hover {
  border-color: var(--app-secondary-border-hover);
  background-color: var(--p-surface-100);
}

.button-link-ghost {
  color: var(--app-primary-600);
}

.button-link-ghost:hover {
  background-color: color-mix(in srgb, var(--app-primary-500) 8%, white);
}

.button-link-sm {
  min-height: 32px;
  padding: 0.5rem 0.75rem;
  font-size: 0.875rem;
}

.button-link-anchor:focus-visible {
  outline: none;
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--app-primary-500) 24%, white);
}

.button-link-anchor[aria-disabled='true'] {
  pointer-events: none;
  cursor: not-allowed;
  opacity: var(--p-disabled-opacity, 0.6);
}

.button-link-block {
  width: 100%;
  justify-content: center;
}
</style>
