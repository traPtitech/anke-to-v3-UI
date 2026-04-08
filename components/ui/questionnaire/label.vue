<template>
  <div class="questionnaire-label">
    <slot></slot>
  </div>
</template>

<style scoped lang="scss">
.questionnaire-label {
  font-weight: 600;
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: var(--p-text-muted-color);
  margin-bottom: 4px;
}
</style>
