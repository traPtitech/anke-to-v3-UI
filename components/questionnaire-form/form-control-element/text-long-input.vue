<script lang="ts" setup>
import type { QuestionSettingsTextLong } from '../type';

const question = defineModel<QuestionSettingsTextLong>({
  required: true,
});

const maxLength = computed({
  get: () => question.value.max_length,
  set: (value) => {
    question.value.max_length = value ?? undefined;
  },
});
</script>

<template>
  <div class="form-control-element-text-input">
    <TextArea placeholder="回答 (長文テキスト)" disabled />
    <InputNumber v-model="maxLength" placeholder="最大文字数 (任意)" />
  </div>
</template>

<style scoped lang="scss">
.form-control-element-text-input {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
</style>
