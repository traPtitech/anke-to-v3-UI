<script lang="ts" setup>
import { useQuestionValidity, type ResponseBodyNumber } from '../store';

const question = defineModel<ResponseBodyNumber>({ required: true });
const { valid } = useQuestionValidity(question.value);
</script>

<template>
  <InputNumber
    v-model="question.answer"
    class="question-number-input"
    :class="{ 'p-invalid': !valid }"
    placeholder="回答を入力"
    :input-props="{ required: question.is_required }"
  />
</template>

<style lang="scss" scoped>
.question-number-input {
  width: 100%;
}
</style>
