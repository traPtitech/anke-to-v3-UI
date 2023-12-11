<script lang="ts" setup>
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
    <RadioButton :model-value="false" :disabled="true" />
  </ChoiceGroup>
</template>

<style lang="scss" scoped></style>
