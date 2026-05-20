<template>
  <div class="question-answer-view">
    <slot />
  </div>
</template>

<style lang="scss" scoped>
.question-answer-view {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 6px;
  min-width: 0;
  min-height: 28px;
}
</style>
