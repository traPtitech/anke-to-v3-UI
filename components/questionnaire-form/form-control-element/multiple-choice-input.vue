<script lang="ts" setup>
import type { QuestionSettingsMultipleChoice } from '../type';
import ChoiceGroup from './choice-group.vue';

defineProps<{
  showChoiceOptionRequiredError?: boolean;
}>();

const question = defineModel<QuestionSettingsMultipleChoice>({
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
    <Checkbox :model-value="false" disabled />
  </ChoiceGroup>
</template>
