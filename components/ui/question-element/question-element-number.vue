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

const answerModel = computed({
  get: () => question.value.answer,
  set: (val: number | null) => {
    if (val === null) {
      question.value.answer = undefined;
    } else {
      question.value.answer = val;
    }
  },
});
</script>

<template>
  <div v-if="props.mode === 'view'" class="question-answer-view">
    <span v-if="question.answer !== undefined" class="answer-text">{{ question.answer }}</span>
    <span v-else class="answer-empty">（未回答）</span>
  </div>
  <InputNumber
    v-else
    v-model="answerModel"
    class="question-element-number"
    placeholder="回答を入力"
    :input-props="{ required: question.is_required }"
    :class="{ 'p-invalid': !valid }"
  />
</template>

<style lang="scss" scoped>
.question-element-number {
  width: min(100%, 240px);
}
</style>
