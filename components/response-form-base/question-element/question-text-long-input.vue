<script lang="ts" setup>
import type { ResponseSettingsTextLong } from '~/components/response-form-base/response-form-base-settings';
import type {
  ResponseFormQuestionInvalid,
  ResponseFormQuestionSettingsBase,
  ResponseFormQuestionSettingsTextLong,
} from '~/components/response-form-base/questionnaire-settings';

type ModelValue = ResponseSettingsTextLong &
  ResponseFormQuestionSettingsTextLong &
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
  <Textarea
    v-model="question.textLong"
    class="question-text-long-input"
    :class="{ 'p-invalid': question.isInvalid }"
    placeholder="回答を入力"
    :required="question.required"
  />
</template>

<style lang="scss" scoped>
.question-text-long-input {
  width: 100%;
}
</style>
