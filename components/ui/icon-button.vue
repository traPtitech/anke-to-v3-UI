<script lang="ts" setup>
const props = defineProps<{
  variant: 'primary' | 'secondary';
  icon: string;
  disabled?: boolean;
  loading?: boolean;
  title?: string;
}>();
</script>

<template>
  <Button
    :severity="variant"
    :disabled="props.disabled || props.loading"
    :pt="{ root: { title: props.title } }"
    class="icon-button"
    :aria-busy="props.loading ? 'true' : undefined"
  >
    <Icon :name="props.loading ? 'mdi:loading' : props.icon" size="24px" :class="{ 'loading-icon': props.loading }" />
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

.loading-icon {
  animation: icon-button-spin 0.8s linear infinite;
}

@keyframes icon-button-spin {
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
}
</style>
