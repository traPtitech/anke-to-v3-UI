<script lang="ts" setup>
import {
  useQuestionValidity,
  type QuestionElementMode,
  type QuestionElementText,
} from './composables';

const props = defineProps<{
  mode: QuestionElementMode;
}>();

const question = defineModel<QuestionElementText>({ required: true });
const { valid } = useQuestionValidity(question.value);
</script>

<template>
  <div v-if="props.mode === 'view'" class="question-answer-view">
    <span v-if="question.answer" class="answer-text">{{ question.answer }}</span>
    <span v-else class="answer-empty">（未回答）</span>
  </div>
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
