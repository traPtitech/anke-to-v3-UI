<script setup lang="ts">
import type { GatewayQuestion } from '~/models/question';

const props = defineProps<{
  question: GatewayQuestion;
}>();

const typeLabel = computed(() => {
  const typeMap: Record<string, string> = {
    Text: 'テキスト',
    TextLong: '長文',
    Number: '数値',
    SingleChoice: '単一選択',
    MultipleChoice: '複数選択',
    Scale: 'スケール',
  };
  return typeMap[props.question.question_type] || props.question.question_type;
});
</script>

<template>
  <div class="question-type-badge">
    {{ typeLabel }}
  </div>
</template>

<style lang="scss" scoped>
.question-type-badge {
  display: inline-block;
  padding: 3px 10px;
  background-color: var(--p-primary-50);
  color: var(--p-primary-700);
  border: 1px solid var(--p-primary-200);
  font-size: 12px;
  font-weight: 500;
  border-radius: 999px;
}
</style>
