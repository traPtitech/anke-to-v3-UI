<script lang="ts" setup>
import type { ResponseSettingsText } from '~/components/new-response-form/new-response-form-settings';
import type {
  ResponseFormQuestionInvalid,
  ResponseFormQuestionSettingsBase,
  ResponseFormQuestionSettingsText,
} from '~/components/new-response-form/questionnaire-settings';

type ModelValue = ResponseSettingsText &
  ResponseFormQuestionSettingsText &
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
  <InputText
    v-model="question.text"
    class="question-text-input"
    :class="{ 'p-invalid': question.isInvalid }"
    placeholder="回答を入力"
    :required="question.required"
  />
</template>

<style lang="scss" scoped>
.question-text-input {
  width: 100%;
}
</style>
