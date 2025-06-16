<script lang="ts" setup>
import { useQuestionValidity, type ResponseBodyTextLong } from '../store';

const question = defineModel<ResponseBodyTextLong>({ required: true });
const { valid } = useQuestionValidity(question.value);
</script>

<template>
  <Textarea
    v-model="question.answer"
    class="question-text-long-input"
    :class="{ 'p-invalid': !valid }"
    placeholder="回答を入力"
    :required="question.is_required"
    auto-resize
  />
</template>

<style lang="scss" scoped>
.question-text-long-input {
  width: 100%;
}
</style>
