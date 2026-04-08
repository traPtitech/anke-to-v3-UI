<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    title: string;
    message?: string;
    retryLabel?: string;
  }>(),
  {
    message: '',
    retryLabel: '再読み込み',
  },
);

defineEmits<{
  retry: [];
}>();
</script>

<template>
  <div class="error-reload-panel" role="alert">
    <div class="error-reload-title-row">
      <Icon name="mdi:alert-circle-outline" size="22px" />
      <p class="error-reload-title">{{ props.title }}</p>
    </div>
    <p v-if="props.message" class="error-reload-message">{{ props.message }}</p>
    <Button
      class="error-reload-button"
      severity="secondary"
      @click="$emit('retry')"
    >
      <Icon name="mdi:refresh" size="18px" />
      <span>{{ props.retryLabel }}</span>
    </Button>
  </div>
</template>

<style scoped lang="scss">
.error-reload-panel {
  border: 1px solid var(--p-red-200);
  border-radius: 12px;
  background-color: var(--p-surface-0);
  padding: 18px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  color: var(--p-red-900);
}

.error-reload-title-row {
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.error-reload-title {
  margin: 0;
  font-weight: 700;
}

.error-reload-message {
  margin: 0;
  font-size: 14px;
}

.error-reload-button {
  width: fit-content;
  display: inline-flex;
  align-items: center;
  gap: 6px;
}
</style>
