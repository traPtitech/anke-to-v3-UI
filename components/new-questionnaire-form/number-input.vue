<script lang="ts" setup>
defineProps<{
  modelValue: QuestionSettingsNumber;
}>();

defineEmits<{
  (e: 'update:modelValue', value: QuestionSettingsNumber): void;
}>();
</script>

<template>
  <InputNumber placeholder="回答 (数値)" :disabled="true" />
</template>

<style lang="scss" scoped></style>
