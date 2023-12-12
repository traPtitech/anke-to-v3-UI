<script lang="ts" setup>
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
