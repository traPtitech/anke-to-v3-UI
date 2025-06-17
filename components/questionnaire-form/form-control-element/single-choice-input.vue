<script lang="ts" setup>
import type { QuestionSettingsSingleChoice } from '../type';
import ChoiceGroup from './choice-group.vue';

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
  <ChoiceGroup v-model="options">
    <RadioButton :model-value="false" disabled />
  </ChoiceGroup>
</template>
