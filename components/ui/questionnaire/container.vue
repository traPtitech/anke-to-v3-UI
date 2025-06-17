<script lang="ts" setup>
const props = defineProps<{
  grid?: boolean;
}>();
</script>

<template>
  <div
    :class="
      props.grid ? 'questionnaire-grid-container' : 'questionnaire-container'
    "
  >
    <slot />
  </div>
</template>

<style scoped lang="scss">
.questionnaire-grid-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  padding: 32px;
  border: 1px solid var(--p-surface-300);
  border-radius: var(--p-border-radius-md);
}

@media screen and (max-width: variables.$breakpoint-md) {
  .questionnaire-grid-container {
    grid-template-columns: 1fr;
  }
}

.questionnaire-container {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 32px;
  border: 1px solid var(--p-surface-300);
  border-radius: var(--p-border-radius-md);
}
</style>
