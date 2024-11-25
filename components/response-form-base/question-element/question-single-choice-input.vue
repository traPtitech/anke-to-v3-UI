<script lang="ts" setup>
import type { ResponseSettingsSingleChoice } from '~/components/response-form-base/response-form-base-settings';
import type {
  ResponseFormQuestionInvalid,
  ResponseFormQuestionSettingsBase,
  ResponseFormQuestionSettingsSingleChoice,
} from '~/components/response-form-base/questionnaire-settings';

type ModelValue = ResponseSettingsSingleChoice &
  ResponseFormQuestionSettingsSingleChoice &
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

const name = computed(() => `single-choice-input-${createId()}`);
const optionIds = question.value.options.map(() => createId());
</script>

<template>
  <div class="question-single-choice-input-container">
    <div
      v-for="(option, i) in question.options"
      :key="i"
      class="question-single-choice-input-element"
    >
      <RadioButton
        v-model="question.index"
        :input-props="{ required: question.required }"
        :value="i"
        :name="name"
        :input-id="optionIds[i]"
        :aria-required="question.required"
        :pt="{ hiddenInput: { required: question.required } }"
        oninvalid="console.log($event)"
        :class="{ 'p-invalid': question.isInvalid }"
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
