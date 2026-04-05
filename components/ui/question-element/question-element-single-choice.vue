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
  <div v-if="props.mode === 'view'" class="question-answer-view">
    <template v-if="question.options && question.options.length > 0">
      <span
        v-for="option in question.options"
        :key="option"
        class="answer-chip"
        :class="{ 'answer-chip-unselected': question.answer !== option }"
      >
        <Icon v-if="question.answer === option" name="mdi:check-circle" size="14px" />
        {{ option }}
      </span>
    </template>
    <span v-if="!question.answer" class="answer-empty">
      <br v-if="question.options && question.options.length > 0" />
      （未回答）
    </span>
  </div>
  <div v-else class="question-element-single-choice-container">
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
        :class="{ 'p-invalid': !valid }"
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
