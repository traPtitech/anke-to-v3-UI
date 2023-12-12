<script lang="ts" setup>
const props = defineProps<{
  modelValue: QuestionSettingsMultipleChoice;
}>();
const question = props.modelValue;

const emit = defineEmits<{
  (e: 'update:modelValue', value: QuestionSettingsMultipleChoice): void;
}>();

const options = computed({
  get: () => question.options,
  set: (options) => emit('update:modelValue', { ...question, options }),
});
</script>

<template>
  <ChoiceGroup v-model="options">
    <Checkbox :model-value="false" disabled></Checkbox>
  </ChoiceGroup>
</template>

<style lang="scss" scoped></style>
