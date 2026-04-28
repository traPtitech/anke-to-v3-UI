<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    title: string;
    message?: string;
    retryLabel?: string;
    showRetry?: boolean;
    iconName?: string;
  }>(),
  {
    message: '',
    retryLabel: '再読み込み',
    showRetry: false,
    iconName: 'mdi:alert-circle-outline',
  },
);

defineEmits<{
  retry: [];
}>();
</script>

<template>
  <div class="error-state-panel" role="alert">
    <Icon :name="props.iconName" size="72px" class="error-state-icon" />
    <p class="error-state-title">{{ props.title }}</p>
    <p v-if="props.message" class="error-state-message">{{ props.message }}</p>
    <slot name="actions">
      <Button v-if="props.showRetry" class="error-state-retry" severity="secondary" @click="$emit('retry')">
        <Icon name="mdi:refresh" size="18px" />
        <span>{{ props.retryLabel }}</span>
      </Button>
    </slot>
  </div>
</template>

<style scoped lang="scss">
.error-state-panel {
  border: 1px solid var(--p-red-200);
  border-radius: 12px;
  background-color: var(--p-surface-0);
  width: 100%;
  max-width: 800px;
  margin: 16px auto;
  padding: 24px 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  text-align: center;
  color: var(--p-red-900);
}

.error-state-icon {
  flex-shrink: 0;
}

.error-state-title {
  margin: 0;
  font-weight: 700;
  font-size: 20px;
  line-height: 1.4;
}

.error-state-message {
  margin: 0;
  line-height: 1.7;
  color: var(--p-text-muted-color);
}

.error-state-retry {
  width: auto;
  display: inline-flex;
  align-items: center;
  gap: 6px;
}
</style>
