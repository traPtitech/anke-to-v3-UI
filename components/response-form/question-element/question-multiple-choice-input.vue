<script lang="ts" setup>
import { createStringId } from '~/utils/create-id';
import { useQuestionValidity, type ResponseBodyMultipleChoice } from '../store';

const question = defineModel<ResponseBodyMultipleChoice>({ required: true });
const { valid } = useQuestionValidity(question.value);

const optionIds = computed(() =>
  question.value.options.map(() => createStringId()),
);
const name = computed(() => `multiple-choice-input-${createStringId()}`);
</script>

<template>
  <fieldset class="question-multiple-choice-input-container">
    <div
      v-for="(option, i) in question.options"
      :key="optionIds[i]"
      class="question-multiple-choice-input-element"
    >
      <Checkbox
        v-model="question.answer"
        :value="i"
        :input-id="`${optionIds[i]}`"
        :name="name"
        :required="question.is_required"
        :class="{ 'p-invalid': !valid }"
      />
      <label
        :for="`${optionIds[i]}`"
        class="question-multiple-choice-input-label"
      >
        {{ option }}
      </label>
    </div>
  </fieldset>
</template>

<style lang="scss" scoped>
.question-multiple-choice-input-container {
  display: flex;
  flex-direction: column;
  gap: 16px;
  border: none;
}

.question-multiple-choice-input-element {
  display: flex;
  flex-direction: row;
  align-items: center;
}

.question-multiple-choice-input-label {
  padding-left: 8px;
}
</style>
