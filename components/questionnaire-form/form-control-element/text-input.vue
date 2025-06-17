<script lang="ts" setup>
import type { QuestionSettingsText } from '../type';

const question = defineModel<QuestionSettingsText>({
  required: true,
});
</script>

<template>
  <div class="form-control-element-text-input">
    <InputText placeholder="回答 (1行テキスト)" disabled />
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
