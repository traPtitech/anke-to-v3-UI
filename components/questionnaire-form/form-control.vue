<script lang="ts" setup>
import type { GatewayQuestionType } from '~/models/question';
import type { QuestionSettings } from './type';

const question = defineModel<QuestionSettings>({ required: true });

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
</script>

<template>
  <div class="form-control-container">
    <InputText v-model="question.title" required placeholder="質問" />
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
    />
    <FormControlElementMultipleChoiceInput
      v-if="question.question_type === 'MultipleChoice'"
      v-model="question"
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
          <InputSwitch v-model="question.is_required" />
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
