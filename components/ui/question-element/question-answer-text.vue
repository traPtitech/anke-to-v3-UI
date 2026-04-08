<script setup lang="ts">
defineProps<{
  value?: string | number;
}>();
</script>

<template>
  <span class="answer-text">
    <slot>
      {{ value }}
    </slot>
  </span>
</template>

<style lang="scss" scoped>
.answer-text {
  font-size: 15px;
  color: var(--p-text-color);
  line-height: 1.6;
  white-space: pre-wrap;
}
</style>
