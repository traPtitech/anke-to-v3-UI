<script lang="ts" setup>
import type { QuestionSettingsScale } from '../type';

const question = defineModel<QuestionSettingsScale>({
  required: true,
});
</script>

<template>
  <div class="scale-input-container">
    <div class="scale-input-group">
      <Dropdown
        v-model="question.min_value"
        placeholder="最小値"
        :options="[0, 1]"
        class="scale-input-dropdown"
        scroll-height="320px"
        panel-class="scale-input-dropdown-panel"
      />
      <InputText
        v-model="question.min_label"
        placeholder="最小値のラベル (任意)"
        class="scale-input-label-input"
      />
    </div>
    <div class="scale-input-group">
      <Dropdown
        v-model="question.max_value"
        placeholder="最大値"
        :options="[2, 3, 4, 5, 6, 7, 8, 9, 10]"
        scroll-height="320px"
      />
      <InputText
        v-model="question.max_label"
        placeholder="最大値のラベル (任意)"
        class="scale-input-label-input"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.scale-input-container {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.scale-input-group {
  display: flex;
  gap: 8px;
}

.scale-input-label-input {
  flex: 1;
}
</style>
