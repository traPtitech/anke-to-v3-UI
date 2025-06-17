<script lang="ts" setup>
import type { QuestionSettingsNumber } from '../type';

const question = defineModel<QuestionSettingsNumber>({
  required: true,
});
</script>

<template>
  <div class="form-control-element-number-input-container">
    <InputNumber v-model="question.min_value" placeholder="最小値 (任意)" />
    <InputNumber v-model="question.max_value" placeholder="最大値 (任意)" />
  </div>
</template>

<style lang="scss" scoped>
.form-control-element-number-input-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
}
</style>
