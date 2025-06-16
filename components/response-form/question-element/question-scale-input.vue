<script lang="ts" setup>
import { createStringId } from '~/utils/create-id';
import { useQuestionValidity, type ResponseBodyScale } from '../store';

const question = defineModel<ResponseBodyScale>({ required: true });
const { valid } = useQuestionValidity(question.value);

const optionLength = computed(
  () => question.value.max_value - question.value.min_value + 1,
);

const scaleInputs = computed(() =>
  new Array(optionLength.value).fill('').map(() => createStringId()),
);

const name = computed(() => `scale-input-${createStringId()}`);
</script>

<template>
  <div class="question-scale-input-container">
    <div>
      {{ question.min_label }}
    </div>
    <div
      v-for="(id, i) in scaleInputs"
      :key="id"
      class="question-scale-input-options"
    >
      <RadioButton
        v-model="question.answer"
        :input-id="id"
        :value="i + question.min_value"
        :name="name"
        :aria-required="question.is_required"
        :pt="{ hiddenInput: { required: question.is_required } }"
        :class="{ 'p-invalid': !valid }"
      />
      <label :for="id">{{ i + question.min_value }}</label>
    </div>
    <div>
      {{ question.max_label }}
    </div>
  </div>
</template>

<style lang="scss" scoped>
.question-scale-input-container {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  max-width: calc(128px * v-bind(optionLength));
  margin: 0 auto;
}

.question-scale-input-options {
  display: flex;
  align-items: center;
  gap: 8px;
}

@media screen and (max-width: $breakpoint-sm) {
  .question-scale-input-container {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
    max-width: 100%;
  }
}
</style>
