<script lang="ts" setup>
import type { ResponseSettingsNumber } from '~/components/form-response-base/form-response-base-settings';
import type {
  ResponseFormQuestionInvalid,
  ResponseFormQuestionSettingsBase,
  ResponseFormQuestionSettingsNumber,
} from '~/components/form-response-base/questionnaire-settings';

type ModelValue = ResponseSettingsNumber &
  ResponseFormQuestionSettingsNumber &
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
</script>

<template>
  <InputNumber
    v-model="question.number"
    class="question-number-input"
    :class="{ 'p-invalid': question.isInvalid }"
    placeholder="回答を入力"
    :input-props="{ required: question.required }"
  />
</template>

<style lang="scss" scoped>
.question-number-input {
  width: 100%;
}
</style>
~/components/form-response-base/questionnaire-settings
