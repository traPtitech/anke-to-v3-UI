<script lang="ts" setup>
import type { QuestionSettingsSingleChoice } from '../type';
import ChoiceGroup from './choice-group.vue';

const props = defineProps<{
  modelValue: QuestionSettingsSingleChoice;
}>();
const question = props.modelValue;

const emit = defineEmits<{
  (e: 'update:modelValue', value: QuestionSettingsSingleChoice): void;
}>();

const options = computed({
  get: () => question.options,
  set: (options) => emit('update:modelValue', { ...question, options }),
});
</script>

<template>
  <ChoiceGroup v-model="options">
    <RadioButton :model-value="false" disabled />
  </ChoiceGroup>
</template>

<style lang="scss" scoped></style>
