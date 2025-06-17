<script lang="ts" setup>
import {
  useQuestionValidity,
  type QuestionElementMode,
  type QuestionElementTextLong,
} from './composables';

const props = defineProps<{
  mode: QuestionElementMode;
}>();

const question = defineModel<QuestionElementTextLong>({ required: true });
const { valid } = useQuestionValidity(question.value);
</script>

<template>
  <TextArea
    v-model="question.answer"
    class="question-element-text-long"
    placeholder="回答を入力"
    auto-resize
    :required="question.is_required"
    :class="{ 'p-invalid': props.mode === 'edit' && !valid }"
    :readonly="props.mode === 'view'"
  />
</template>

<style lang="scss" scoped>
.question-element-text-long {
  width: 100%;
}
</style>
