<script lang="ts" setup>
defineProps<{
  modelValue: QuestionSettingsText;
}>();

defineEmits<{
  (e: 'update:modelValue', value: QuestionSettingsText): void;
}>();
</script>

<template>
  <InputText placeholder="回答 (1行テキスト)" :disabled="true" />
</template>

<style lang="scss" scoped></style>
