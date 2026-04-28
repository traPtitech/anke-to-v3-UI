<script lang="ts" setup>
import { useQuestionValidity, type QuestionElementMode, type QuestionElementNumber } from './composables';
import QuestionAnswerEmpty from './question-answer-empty.vue';
import QuestionAnswerText from './question-answer-text.vue';
import QuestionAnswerView from './question-answer-view.vue';

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
  <QuestionAnswerView v-if="props.mode === 'view'">
    <QuestionAnswerText v-if="question.answer !== undefined" :value="question.answer" />
    <QuestionAnswerEmpty v-else />
  </QuestionAnswerView>
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
