<script setup lang="ts">
const props = defineProps<{
  to?: string;
}>();
</script>

<template>
  <Button v-slot="slotProps" as-child variant="link">
    <NuxtLink v-bind="slotProps" :to="props.to" class="button-link">
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
</style>
