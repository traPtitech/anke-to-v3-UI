<script lang="ts" setup>
import type { QuestionSettingsScale } from '~/components/new-questionnaire-form/type';

const props = defineProps<{
  modelValue: QuestionSettingsScale;
}>();
const question = props.modelValue;

const emit = defineEmits<{
  (e: 'update:modelValue', value: QuestionSettingsScale): void;
}>();

const state = computed({
  get: () => question,
  set: (value) => emit('update:modelValue', value),
});
</script>

<template>
  <div class="scale-input-container">
    <div class="scale-input-group">
      <Dropdown
        v-model="state.minValue"
        placeholder="最小値"
        :options="[0, 1]"
        class="scale-input-dropdown"
        scroll-height="320px"
        panel-class="scale-input-dropdown-panel"
      />
      <InputText
        v-model="state.minLabel"
        placeholder="最小値のラベル (任意)"
        class="scale-input-label-input"
      />
    </div>
    <div class="scale-input-group">
      <Dropdown
        v-model="state.maxValue"
        placeholder="最大値"
        :options="[2, 3, 4, 5, 6, 7, 8, 9, 10]"
        scroll-height="320px"
      />
      <InputText
        v-model="state.maxLabel"
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
