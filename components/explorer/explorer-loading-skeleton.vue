<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    cardCount?: number;
  }>(),
  { cardCount: 6 },
);
</script>

<template>
  <div class="explorer-loading-skeleton" aria-hidden="true">
    <Paginator
      :first="0"
      :rows="1"
      :total-records="1"
      tabindex="-1"
      template="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink"
    />

    <div class="skeleton-card-list">
      <article
        v-for="index in props.cardCount"
        :key="`skeleton-${index}`"
        class="skeleton-card"
      >
        <div class="skeleton-line skeleton-badge" />
        <div class="skeleton-line skeleton-title" />
        <div class="skeleton-line skeleton-desc" />
        <div class="skeleton-line skeleton-due" />
      </article>
    </div>

    <Paginator
      :first="0"
      :rows="1"
      :total-records="1"
      template="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink"
      tabindex="-1"
    />
  </div>
</template>

<style scoped lang="scss">
.paginator-placeholder {
  height: 4rem;
  border: 1px solid var(--p-surface-300);
  border-radius: var(--p-border-radius-md);
  background-color: var(--p-surface-0);
}

.skeleton-card-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.skeleton-card {
  border: 1px solid var(--p-surface-300);
  border-radius: var(--p-border-radius-md);
  background-color: var(--p-surface-0);
  padding: 14px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.skeleton-line {
  border-radius: 999px;
  background-color: var(--p-surface-200);
}

.skeleton-badge {
  width: 74px;
  height: 22px;
}

.skeleton-title {
  width: min(68%, 540px);
  height: 24px;
}

.skeleton-desc {
  width: 100%;
  height: 16px;
}

.skeleton-due {
  width: 180px;
  height: 16px;
}
</style>
