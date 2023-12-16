<script lang="ts" setup>
import type { QuestionSettingsTextLong } from '~/components/new-questionnaire-form/type';

defineProps<{
  modelValue: QuestionSettingsTextLong;
}>();

defineEmits<{
  (e: 'update:modelValue', value: QuestionSettingsTextLong): void;
}>();
</script>

<template>
  <Textarea placeholder="回答 (長文テキスト)" disabled />
</template>

<style lang="scss" scoped></style>
