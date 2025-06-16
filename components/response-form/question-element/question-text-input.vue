<script lang="ts" setup>
import { useQuestionValidity, type ResponseBodyText } from '../store';

const question = defineModel<ResponseBodyText>({ required: true });
const { valid } = useQuestionValidity(question.value);
</script>

<template>
  <InputText
    v-model="question.answer"
    class="question-text-input"
    :class="{ 'p-invalid': !valid }"
    placeholder="回答を入力"
    :required="question.is_required"
  />
</template>

<style lang="scss" scoped>
.question-text-input {
  width: 100%;
}
</style>
