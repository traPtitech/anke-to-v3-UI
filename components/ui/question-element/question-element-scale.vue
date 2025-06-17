<script lang="ts" setup>
import {
  useQuestionValidity,
  type QuestionElementMode,
  type QuestionElementScale,
} from './composables';

const props = defineProps<{
  mode: QuestionElementMode;
}>();

const question = defineModel<QuestionElementScale>({ required: true });
const { valid } = useQuestionValidity(question.value);

const optionLength = computed(
  () => question.value.max_value - question.value.min_value + 1,
);

const scaleInputs = new Array(optionLength.value).fill('').map(() => useId());

const name = `scale-input-${useId()}`;
</script>

<template>
  <div class="question-element-scale-container">
    <div>
      {{ question.min_label }}
    </div>
    <div
      v-for="(id, i) in scaleInputs"
      :key="id"
      class="question-element-scale-options"
    >
      <RadioButton
        v-model="question.answer"
        :input-id="id"
        :value="i + question.min_value"
        :name="name"
        :aria-required="question.is_required"
        :pt="{ hiddenInput: { required: question.is_required } }"
        :class="{ 'p-invalid': props.mode === 'edit' && !valid }"
        :readonly="props.mode === 'view'"
      />
      <label :for="id">{{ i + question.min_value }}</label>
    </div>
    <div>
      {{ question.max_label }}
    </div>
  </div>
</template>

<style lang="scss" scoped>
.question-element-scale-container {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  max-width: calc(128px * v-bind(optionLength));
  margin: 0 auto;
}

.question-element-scale-options {
  display: flex;
  align-items: center;
  gap: 8px;
}

@media screen and (max-width: variables.$breakpoint-sm) {
  .question-element-scale-container {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
    max-width: 100%;
  }
}
</style>
