<script lang="ts" setup>
import type { ResponseSettingsMultipleChoice } from '~/components/new-response-form/new-response-form-settings';
import type {
  ResponseFormQuestionInvalid,
  ResponseFormQuestionSettingsBase,
  ResponseFormQuestionSettingsMultipleChoice,
} from '~/components/new-response-form/questionnaire-settings';

type ModelValue = ResponseSettingsMultipleChoice &
  ResponseFormQuestionSettingsMultipleChoice &
  ResponseFormQuestionSettingsBase &
  ResponseFormQuestionInvalid;

const props = defineProps<{
  modelValue: ModelValue;
}>();
const emit = defineEmits<{
  (e: 'update:modelValue', value: ModelValue): void;
}>();

const question = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
});

const optionIds = question.value.options.map(() => createId());
const name = computed(() => `multiple-choice-input-${createId()}`);
</script>

<template>
  <fieldset class="question-multiple-choice-input-container">
    <div
      v-for="(option, i) in question.options"
      :key="optionIds[i]"
      class="question-multiple-choice-input-element"
    >
      <Checkbox
        v-model="question.indexes"
        :value="i"
        :input-id="optionIds[i]"
        :name="name"
        :aria-required="question.required"
        :pt="{
          hiddenInput: {
            required: question.required && question.indexes.length === 0,
          },
        }"
        :class="{ 'p-invalid': question.isInvalid }"
      />
      <label :for="optionIds[i]" class="question-multiple-choice-input-label">
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
