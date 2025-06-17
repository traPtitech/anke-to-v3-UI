<script lang="ts" setup>
import {
  useQuestionValidity,
  type QuestionElementMode,
  type QuestionElementNumber,
} from './composables';

const props = defineProps<{
  mode: QuestionElementMode;
}>();

const question = defineModel<QuestionElementNumber>({ required: true });
const { valid } = useQuestionValidity(question.value);
</script>

<template>
  <InputNumber
    v-model="question.answer"
    class="question-element-number"
    placeholder="回答を入力"
    :input-props="{ required: question.is_required }"
    :class="{ 'p-invalid': props.mode === 'edit' && !valid }"
    :readonly="props.mode === 'view'"
  />
</template>

<style lang="scss" scoped>
.question-element-number {
  width: min(100%, 240px);
}
</style>
