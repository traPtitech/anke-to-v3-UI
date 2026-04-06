<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    variant?: 'questionnaire' | 'response';
  }>(),
  {
    variant: 'questionnaire',
  },
);

const loadingText = computed(() => {
  if (props.variant === 'response') {
    return '回答を読み込み中...';
  }

  return 'アンケートを読み込み中...';
});
</script>

<template>
  <div
    class="detail-loading-indicator"
    :class="props.variant"
    role="status"
    aria-live="polite"
  >
    <ProgressSpinner
      class="detail-loading-spinner"
      stroke-width="4"
      animation-duration="0.8s"
      fill="transparent"
    />
    <p class="loading-text">{{ loadingText }}</p>
  </div>
</template>

<style scoped lang="scss">
.detail-loading-indicator {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
  width: 100%;
  min-height: 260px;
  margin: 0 auto;
  padding: 36px 20px;
  border: 1px solid var(--p-surface-200);
  border-radius: 12px;
  background-color: var(--p-surface-0);
}

.detail-loading-indicator.questionnaire {
  max-width: 1080px;
}

.detail-loading-indicator.response {
  max-width: 800px;
}

.detail-loading-spinner {
  width: 44px;
  height: 44px;
}

.detail-loading-spinner :deep(.p-progressspinner-circle) {
  stroke: var(--p-primary-500);
}

.loading-text {
  margin: 0;
  font-size: 14px;
  color: var(--p-text-secondary);
  font-weight: 500;
}

@media screen and (max-width: 560px) {
  .detail-loading-indicator {
    min-height: 220px;
    padding: 28px 14px;
  }
}
</style>
