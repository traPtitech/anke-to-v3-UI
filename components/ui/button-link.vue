<script setup lang="ts">
const props = defineProps<{
  to?: string;
  disabled?: boolean;
  title?: string;
}>();
</script>

<template>
  <Button v-slot="slotProps" as-child variant="link" :disabled="props.disabled">
    <NuxtLink
      v-bind="slotProps"
      :to="props.to"
      class="button-link"
      :disabled="props.disabled"
      :title="props.title"
    >
      <slot />
    </NuxtLink>
  </Button>
</template>

<style lang="scss" scoped>
.button-link {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  text-decoration: none;
  font-weight: bold;
  padding: 8px 16px;
  border-radius: var(--p-border-radius-md);
  transition: background-color 0.3s ease;
  background-color: var(--p-primary-50);

  &:hover {
    background-color: var(--p-primary-100);
  }

  &:active {
    background-color: var(--p-primary-200);
  }
}

.button-link[disabled='true'] {
  pointer-events: none;
  opacity: 0.6;
  color: var(--p-text-disabled);
  background-color: var(--p-surface-100);
}
</style>
