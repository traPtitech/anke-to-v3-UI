<script lang="ts" setup>
import { type QuestionElementMode, type QuestionElementMultipleChoice, useQuestionValidity } from './composables';
import QuestionAnswerChip from './question-answer-chip.vue';
import QuestionAnswerEmpty from './question-answer-empty.vue';
import QuestionAnswerView from './question-answer-view.vue';

const props = defineProps<{
  mode: QuestionElementMode;
}>();

const question = defineModel<QuestionElementMultipleChoice>({ required: true });
const { valid } = useQuestionValidity(question.value);

const optionIds = question.value.options.map(() => useId());
const name = `question-element-multiple-choice-${useId()}`;
</script>

<template>
  <QuestionAnswerView v-if="props.mode === 'view'">
    <QuestionAnswerChip
      v-for="option in question.options"
      :key="option"
      :selected="question.answer?.includes(option) ?? false"
    >
      {{ option }}
    </QuestionAnswerChip>
    <QuestionAnswerEmpty
      v-if="!question.answer || question.answer.length === 0"
      :break-before="question.options.length > 0"
    />
  </QuestionAnswerView>
  <CheckboxGroup v-else v-model="question.answer" class="question-element-multiple-choice-container">
    <div v-for="(option, i) in question.options" :key="optionIds[i]" class="question-element-multiple-choice-element">
      <Checkbox
        :value="option"
        :input-id="`${optionIds[i]}`"
        :name="name"
        :required="question.is_required"
        :class="{ 'p-invalid': !valid }"
      />
      <label :for="`${optionIds[i]}`" class="question-element-multiple-choice-label">
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
