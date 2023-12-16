<script lang="ts" setup>
import type { QuestionSettingsNumber } from '~/components/new-questionnaire-form/type';

defineProps<{
  modelValue: QuestionSettingsNumber;
}>();

defineEmits<{
  (e: 'update:modelValue', value: QuestionSettingsNumber): void;
}>();
</script>

<template>
  <InputNumber placeholder="回答 (数値)" disabled />
</template>

<style lang="scss" scoped></style>
