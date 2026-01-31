<script lang="ts" setup>
import {
  useQuestionValidity,
  type QuestionElementMode,
  type QuestionElementSingleChoice,
} from './composables';

const props = defineProps<{
  mode: QuestionElementMode;
}>();

const question = defineModel<QuestionElementSingleChoice>({ required: true });
const { valid } = useQuestionValidity(question.value);

const name = `question-element-single-choice-${useId()}`;
const optionIds = question.value.options.map(() => useId());
</script>

<template>
  <div class="question-element-single-choice-container">
    <div
      v-for="(option, i) in question.options"
      :key="i"
      class="question-element-single-choice-element"
    >
      <RadioButton
        v-model="question.answer"
        :value="option"
        :name="name"
        :input-id="optionIds[i]"
        :aria-required="question.is_required"
        :input-props="{ required: question.is_required }"
        :pt="{ hiddenInput: { required: question.is_required } }"
        :class="{ 'p-invalid': props.mode === 'edit' && !valid }"
        :readonly="props.mode === 'view'"
      />
      <label :for="optionIds[i]" class="question-element-single-choice-label">
        {{ option }}
      </label>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.question-element-single-choice-container {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.question-element-single-choice-element {
  display: flex;
  flex-direction: row;
  align-items: center;
}

.question-element-single-choice-label {
  padding-left: 8px;
}
</style>
