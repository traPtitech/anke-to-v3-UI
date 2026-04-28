<script lang="ts" setup>
import type { QuestionSettingsSingleChoice } from '../type';
import ChoiceGroup from './choice-group.vue';

defineProps<{
  showChoiceOptionRequiredError?: boolean;
}>();

const question = defineModel<QuestionSettingsSingleChoice>({
  required: true,
});

const options = computed({
  get: () => question.value.options,
  set: (options) => {
    question.value.options = options;
  },
});
</script>

<template>
  <ChoiceGroup v-model="options" :show-choice-option-required-error="showChoiceOptionRequiredError">
    <RadioButton :model-value="false" disabled />
  </ChoiceGroup>
</template>
