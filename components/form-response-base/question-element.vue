<script lang="ts" setup>
import type { ResponseSettings } from '~/components/form-response-base/form-response-base-settings';
import type {
  ResponseFormQuestionInvalid,
  ResponseFormQuestionSettings,
} from '~/components/form-response-base/questionnaire-settings';

type ModelValue = ResponseSettings &
  ResponseFormQuestionSettings &
  ResponseFormQuestionInvalid;

const props = defineProps<{ modelValue: ModelValue }>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: ModelValue): void;
}>();

const modelValue = computed({
  get: () => props.modelValue,
  set: (value: ModelValue) => emit('update:modelValue', value),
});
</script>

<template>
  <div class="question-element-container">
    <p class="question-element-title">
      <span class="question-element-title-main">
        {{ modelValue.title }}
      </span>
      <span v-if="modelValue.required" class="question-element-required-chips">
        必須
      </span>
      <span v-else class="question-element-non-required-chips">任意</span>
    </p>
    <p class="question-element-description">{{ modelValue.description }}</p>

    <QuestionTextInput v-if="modelValue.type === 'Text'" v-model="modelValue" />
    <QuestionTextLongInput
      v-if="modelValue.type === 'TextLong'"
      v-model="modelValue"
    />
    <QuestionNumberInput
      v-if="modelValue.type === 'Number'"
      v-model="modelValue"
    />
    <QuestionSingleChoiceInput
      v-if="modelValue.type === 'SingleChoice'"
      v-model="modelValue"
    />
    <QuestionMultipleChoiceInput
      v-if="modelValue.type === 'MultipleChoice'"
      v-model="modelValue"
    />
    <QuestionScaleInput
      v-if="modelValue.type === 'Scale'"
      v-model="modelValue"
    />
    <p v-if="modelValue.isInvalid" class="error-message">
      <small>回答必須の質問です</small>
    </p>
  </div>
</template>

<style lang="scss" scoped>
.question-element-container {
  padding: 16px;
  border: 1px solid var(--surface-d);
  border-radius: var(--border-radius);
}

.question-element-title {
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 8px;
}

.question-element-title-main {
  vertical-align: middle;
}

.question-element-required-chips,
.question-element-non-required-chips {
  vertical-align: middle;
  display: inline-block;
  padding: 4px 8px;
  border-radius: var(--border-radius);
  font-size: 12px;
  font-weight: bold;
  color: white;
  flex-shrink: 0;
  margin-left: 8px;
}

.question-element-required-chips {
  background-color: hsl(0, 62%, 50%);
}

.question-element-non-required-chips {
  background-color: hsl(0, 0%, 60%);
}

.question-element-description {
  font-size: 14px;
  margin-bottom: 16px;
}

.error-message {
  margin-top: 8px;
  color: #f26451;
}
</style>
~/components/form-response-base/questionnaire-settings
