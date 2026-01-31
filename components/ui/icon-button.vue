<script lang="ts" setup>
const props = defineProps<{
  variant: 'primary' | 'secondary';
  icon: string;
  disabled?: boolean;
}>();
</script>

<template>
  <Button
    :outlined="props.variant === 'secondary'"
    :disabled="props.disabled"
    class="icon-button"
  >
    <Icon :name="props.icon" size="24px" />
    <slot />
  </Button>
</template>

<style lang="scss" scoped>
.icon-button {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-weight: bold;
}
</style>
