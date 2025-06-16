<script lang="ts" setup>
import { createStringId } from '~/utils/create-id';
import { useQuestionValidity, type ResponseBodySingleChoice } from '../store';

const question = defineModel<ResponseBodySingleChoice>({ required: true });
const { valid } = useQuestionValidity(question.value);

const name = computed(() => `single-choice-input-${createStringId()}`);
const optionIds = question.value.options.map(() => createStringId());
</script>

<template>
  <div class="question-single-choice-input-container">
    <div
      v-for="(option, i) in question.options"
      :key="i"
      class="question-single-choice-input-element"
    >
      <RadioButton
        v-model="question.answer"
        :input-props="{ required: question.is_required }"
        :value="i"
        :name="name"
        :input-id="optionIds[i]"
        :aria-required="question.is_required"
        :pt="{ hiddenInput: { required: question.is_required } }"
        :class="{ 'p-invalid': !valid }"
      />
      <label :for="optionIds[i]" class="question-single-choice-input-label">
        {{ option }}
      </label>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.question-single-choice-input-container {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.question-single-choice-input-element {
  display: flex;
  flex-direction: row;
  align-items: center;
}

.question-single-choice-input-label {
  padding-left: 8px;
}
</style>
