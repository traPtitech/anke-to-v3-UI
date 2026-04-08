<script lang="ts" setup>
import {
  useQuestionValidity,
  type QuestionElementMode,
  type QuestionElementText,
} from './composables';
import QuestionAnswerEmpty from './question-answer-empty.vue';
import QuestionAnswerText from './question-answer-text.vue';
import QuestionAnswerView from './question-answer-view.vue';

const props = defineProps<{
  mode: QuestionElementMode;
}>();

const question = defineModel<QuestionElementText>({ required: true });
const { valid } = useQuestionValidity(question.value);
</script>

<template>
  <QuestionAnswerView v-if="props.mode === 'view'">
    <QuestionAnswerText v-if="question.answer" :value="question.answer" />
    <QuestionAnswerEmpty v-else />
  </QuestionAnswerView>
  <InputText
    v-else
    v-model="question.answer"
    class="question-element-text"
    placeholder="回答を入力"
    :required="question.is_required"
    :class="{ 'p-invalid': !valid }"
  />
</template>

<style lang="scss" scoped>
.question-element-text {
  width: 100%;
}
</style>
