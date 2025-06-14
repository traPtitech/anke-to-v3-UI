<script lang="ts" setup>
import type { QuestionSettingsText } from '../type';

defineProps<{
  modelValue: QuestionSettingsText;
}>();

defineEmits<{
  (e: 'update:modelValue', value: QuestionSettingsText): void;
}>();
</script>

<template>
  <InputText placeholder="回答 (1行テキスト)" disabled />
</template>

<style lang="scss" scoped></style>
