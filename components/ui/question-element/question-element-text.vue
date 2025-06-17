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
  <InputText
    v-model="question.answer"
    class="question-element-text"
    placeholder="回答を入力"
    :required="question.is_required"
    :class="{ 'p-invalid': props.mode === 'edit' && !valid }"
    :readonly="props.mode === 'view'"
  />
</template>

<style lang="scss" scoped>
.question-element-text {
  width: 100%;
}
</style>
