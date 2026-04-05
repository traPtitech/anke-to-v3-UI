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
  <div v-if="props.mode === 'view'" class="question-answer-view">
    <template v-if="question.options && question.options.length > 0">
      <span
        v-for="option in question.options"
        :key="option"
        class="answer-chip"
        :class="{ 'answer-chip-unselected': !question.answer?.includes(option) }"
      >
        <Icon v-if="question.answer?.includes(option)" name="mdi:check-circle" size="14px" />
        {{ option }}
      </span>
    </template>
    <span v-if="!question.answer || question.answer.length === 0" class="answer-empty">
      <br v-if="question.options && question.options.length > 0" />
      （未回答）
    </span>
  </div>
  <CheckboxGroup
    v-else
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
        :class="{ 'p-invalid': !valid }"
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
