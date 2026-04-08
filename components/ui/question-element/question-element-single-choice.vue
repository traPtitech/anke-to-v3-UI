<script lang="ts" setup>
import {
  useQuestionValidity,
  type QuestionElementMode,
  type QuestionElementSingleChoice,
} from './composables';
import QuestionAnswerChip from './question-answer-chip.vue';
import QuestionAnswerEmpty from './question-answer-empty.vue';
import QuestionAnswerView from './question-answer-view.vue';

const props = defineProps<{
  mode: QuestionElementMode;
}>();

const question = defineModel<QuestionElementSingleChoice>({ required: true });
const { valid } = useQuestionValidity(question.value);

const name = `question-element-single-choice-${useId()}`;
const optionIds = question.value.options.map(() => useId());
</script>

<template>
  <QuestionAnswerView v-if="props.mode === 'view'">
    <QuestionAnswerChip
      v-for="option in question.options"
      :key="option"
      :selected="question.answer === option"
    >
      {{ option }}
    </QuestionAnswerChip>
    <QuestionAnswerEmpty
      v-if="!question.answer"
      :break-before="question.options.length > 0"
    />
  </QuestionAnswerView>
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
