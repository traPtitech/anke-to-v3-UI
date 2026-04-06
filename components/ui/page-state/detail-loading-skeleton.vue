<template>
  <div class="detail-loading-skeleton" aria-hidden="true">
    <div class="skeleton-line skeleton-title" />
    <div class="skeleton-line skeleton-subtitle" />

    <div class="skeleton-grid">
      <div class="skeleton-card" />
      <div class="skeleton-card" />
      <div class="skeleton-card" />
    </div>
  </div>
</template>

<style scoped lang="scss">
.detail-loading-skeleton {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.skeleton-line,
.skeleton-card {
  position: relative;
  overflow: hidden;
  border-radius: var(--p-border-radius-md);
  background-color: var(--p-surface-100);
}

.skeleton-line::after,
.skeleton-card::after {
  content: '';
  position: absolute;
  inset: 0;
  transform: translateX(-100%);
  background: linear-gradient(
    90deg,
    rgba(255, 255, 255, 0) 0%,
    rgba(255, 255, 255, 0.65) 50%,
    rgba(255, 255, 255, 0) 100%
  );
  animation: shimmer 1.2s infinite;
}

.skeleton-title {
  width: min(560px, 95%);
  height: 30px;
}

.skeleton-subtitle {
  width: min(420px, 85%);
  height: 18px;
}

.skeleton-grid {
  display: grid;
  gap: 12px;
}

.skeleton-card {
  height: 110px;
}

@keyframes shimmer {
  100% {
    transform: translateX(100%);
  }
}
</style>
