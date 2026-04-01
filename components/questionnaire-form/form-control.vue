<script lang="ts" setup>
import type { GatewayQuestionType } from '~/models/question';
import FormControlElementMultipleChoiceInput from './form-control-element/multiple-choice-input.vue';
import FormControlElementNumberInput from './form-control-element/number-input.vue';
import FormControlElementScaleInput from './form-control-element/scale-input.vue';
import FormControlElementSingleChoiceInput from './form-control-element/single-choice-input.vue';
import FormControlElementTextInput from './form-control-element/text-input.vue';
import FormControlElementTextLongInput from './form-control-element/text-long-input.vue';
import type { QuestionSettings } from './type';

const props = defineProps<{
  autoFocusTitle?: boolean;
}>();

const question = defineModel<QuestionSettings>({ required: true });
const formControlContainer = ref<HTMLElement>();
const hasFocusedInsideCard = ref(false);
const hasQuestionCardBeenBlurred = ref(false);
const isQuestionTitleFocused = ref(false);

const showQuestionTitleRequiredErrorAfterBlur = computed(
  () => !isQuestionTitleFocused.value && question.value.title.trim() === '',
);
const showChoiceOptionRequiredErrorAfterBlur = computed(
  () => hasQuestionCardBeenBlurred.value,
);

const handleCardFocusIn = () => {
  hasFocusedInsideCard.value = true;
};

const handleCardFocusOut = (event: FocusEvent) => {
  if (!hasFocusedInsideCard.value) return;
  const nextFocusedElement = event.relatedTarget as Node | null;
  if (
    nextFocusedElement &&
    formControlContainer.value?.contains(nextFocusedElement)
  ) {
    return;
  }
  hasQuestionCardBeenBlurred.value = true;
};

defineEmits<{
  (e: 'copy'): void;
  (e: 'delete'): void;
}>();

const typeText: Record<GatewayQuestionType, string> = {
  Text: '1行テキスト',
  TextLong: '長文テキスト',
  Number: '数値',
  SingleChoice: 'ラジオボタン',
  MultipleChoice: 'チェックボックス',
  Scale: '目盛り',
};

const questionType = computed(() => typeText[question.value.question_type]);

watch(
  () => props.autoFocusTitle,
  (shouldFocus) => {
    if (!shouldFocus) return;
    nextTick(() => {
      document
        .getElementById(`question-title-input-${question.value.question_id}`)
        ?.focus();
    });
  },
  { immediate: true },
);
</script>

<template>
  <div
    ref="formControlContainer"
    class="form-control-container"
    @focusin="handleCardFocusIn"
    @focusout="handleCardFocusOut"
  >
    <InputText
      :id="`question-title-input-${question.question_id}`"
      v-model="question.title"
      :class="{ 'p-invalid': showQuestionTitleRequiredErrorAfterBlur }"
      required
      placeholder="質問 (必須)"
      @focus="isQuestionTitleFocused = true"
      @blur="isQuestionTitleFocused = false"
    />
    <small
      v-if="showQuestionTitleRequiredErrorAfterBlur"
      class="invalid-message"
    >
      <Icon name="mdi:alert-circle" size="20px" />
      <span>質問のタイトルを入力してください</span>
    </small>
    <Textarea
      v-model="question.description"
      placeholder="詳細な説明 (任意)"
      class="form-control-description"
      auto-resize
    />

    <FormControlElementTextInput
      v-if="question.question_type === 'Text'"
      v-model="question"
    />
    <FormControlElementTextLongInput
      v-if="question.question_type === 'TextLong'"
      v-model="question"
    />
    <FormControlElementNumberInput
      v-if="question.question_type === 'Number'"
      v-model="question"
    />
    <FormControlElementSingleChoiceInput
      v-if="question.question_type === 'SingleChoice'"
      v-model="question"
      :show-choice-option-required-error="
        showChoiceOptionRequiredErrorAfterBlur
      "
    />
    <FormControlElementMultipleChoiceInput
      v-if="question.question_type === 'MultipleChoice'"
      v-model="question"
      :show-choice-option-required-error="
        showChoiceOptionRequiredErrorAfterBlur
      "
    />
    <FormControlElementScaleInput
      v-if="question.question_type === 'Scale'"
      v-model="question"
    />

    <div class="form-control-footer">
      <div>質問タイプ: {{ questionType }}</div>
      <div class="form-control-footer-actions">
        <div class="form-control-required-switch">
          <label>必須</label>
          <ToggleSwitch v-model="question.is_required" />
        </div>
        <div class="form-control-footer-buttons">
          <Button
            class="p-button-icon-only p-button-text"
            title="質問を複製"
            @click="$emit('copy')"
          >
            <Icon size="24px" name="mdi:content-copy" />
          </Button>
          <Button
            class="p-button-icon-only p-button-text"
            title="質問を削除"
            @click="$emit('delete')"
          >
            <Icon size="24px" name="mdi:trash-can-outline" />
          </Button>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.form-control-container {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-control-description {
  font-size: 14px;
}

.invalid-message {
  display: flex;
  align-items: center;
  gap: 4px;
  color: var(--p-red-500);
}

.form-control-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
}

.form-control-footer-actions {
  display: flex;
  align-items: center;
  gap: 16px;
}

.form-control-footer-buttons {
  display: flex;
  align-items: center;
  gap: 8px;
}

.form-control-required-switch {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: bold;
}
</style>
