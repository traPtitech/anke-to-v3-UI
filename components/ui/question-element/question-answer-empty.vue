<script setup lang="ts">
withDefaults(
  defineProps<{
    breakBefore?: boolean;
  }>(),
  {
    breakBefore: false,
  },
);
</script>

<template>
  <span class="answer-empty">
    <br v-if="breakBefore" />
    （未回答）
  </span>
</template>

<style lang="scss" scoped>
.answer-empty {
  font-size: 14px;
  color: var(--p-text-muted-color);
}
</style>
