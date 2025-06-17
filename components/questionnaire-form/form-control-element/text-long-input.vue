<script lang="ts" setup>
import type { QuestionSettingsTextLong } from '../type';

const question = defineModel<QuestionSettingsTextLong>({
  required: true,
});
</script>

<template>
  <div class="form-control-element-text-input">
    <TextArea placeholder="回答 (長文テキスト)" disabled />
    <InputNumber
      v-model="question.max_length"
      placeholder="最大文字数 (任意)"
    />
  </div>
</template>

<style scoped lang="scss">
.form-control-element-text-input {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
</style>
