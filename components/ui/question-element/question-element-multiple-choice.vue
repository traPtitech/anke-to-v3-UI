<script lang="ts" setup>
import {
  type QuestionElementMode,
  type QuestionElementMultipleChoice,
  useQuestionValidity,
} from './composables';

const props = defineProps<{
  mode: QuestionElementMode;
}>();

const question = defineModel<QuestionElementMultipleChoice>({ required: true });
const { valid } = useQuestionValidity(question.value);

const optionIds = question.value.options.map(() => useId());
const name = `question-element-multiple-choice-${useId()}`;
</script>

<template>
  <CheckboxGroup
    v-model="question.answer"
    class="question-element-multiple-choice-container"
  >
    <div
      v-for="(option, i) in question.options"
      :key="optionIds[i]"
      class="question-element-multiple-choice-element"
    >
      <Checkbox
        :value="option"
        :input-id="`${optionIds[i]}`"
        :name="name"
        :required="question.is_required"
        :class="{ 'p-invalid': props.mode === 'edit' && !valid }"
        :readonly="props.mode === 'view'"
      />
      <label
        :for="`${optionIds[i]}`"
        class="question-element-multiple-choice-label"
      >
        {{ option }}
      </label>
    </div>
  </CheckboxGroup>
</template>

<style lang="scss" scoped>
.question-element-multiple-choice-container {
  display: flex;
  flex-direction: column;
  gap: 16px;
  border: none;
}

.question-element-multiple-choice-element {
  display: flex;
  flex-direction: row;
  align-items: center;
}

.question-element-multiple-choice-label {
  padding-left: 8px;
}
</style>
