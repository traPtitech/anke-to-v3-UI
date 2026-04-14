<script setup lang="ts">
import type { RouteLocationRaw } from 'vue-router';

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
    :pt="{ root: { title: props.title } }"
  >
    <NuxtLink
      v-bind="slotProps"
      :to="props.to"
      :class="['button-link-anchor', $attrs.class]"
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
  opacity: var(--p-disabled-opacity, 0.6);
}

.button-link-anchor.p-button[aria-disabled='true'] {
  box-shadow: none;
  filter: saturate(0.85);
}

.button-link-block {
  width: 100%;
  justify-content: center;
}
</style>
