<script lang="ts" setup>
// MEMO: propsとemitの型をunknownにしないとform-control.vueで謎の型エラーが出る
defineProps<{
  modelValue: unknown;
}>();

defineEmits<{
  (e: 'update:modelValue', value: unknown): void;
}>();
</script>

<template>
  <InputText placeholder="回答 (1行テキスト)" disabled />
</template>

<style lang="scss" scoped></style>
