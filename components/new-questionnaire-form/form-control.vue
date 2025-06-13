<script lang="ts" setup>
import type { QuestionSettings } from '~/components/new-questionnaire-form/type';
import MultipleChoiceInput from './form-control-element/multiple-choice-input.vue';
import NumberInput from './form-control-element/number-input.vue';
import ScaleInput from './form-control-element/scale-input.vue';
import SingleChoiceInput from './form-control-element/single-choice-input.vue';
import TextInput from './form-control-element/text-input.vue';
import TextLongInput from './form-control-element/text-long-input.vue';

const props = defineProps<{
  modelValue: QuestionSettings;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: QuestionSettings): void;
  (e: 'copy'): void;
  (e: 'delete'): void;
}>();

const question = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
});

const formComponents = {
  Text: TextInput,
  TextLong: TextLongInput,
  MultipleChoice: MultipleChoiceInput,
  SingleChoice: SingleChoiceInput,
  Number: NumberInput,
  Scale: ScaleInput,
} satisfies Record<QuestionSettings['question_type'], unknown>;

const formComponent = computed(
  () => formComponents[question.value.question_type],
);
</script>

<template>
  <div class="form-control-container">
    <InputText v-model="question.title" required placeholder="質問" />
    <Textarea
      v-model="question.description"
      placeholder="詳細な説明 (任意)"
      class="form-control-description"
    />

    <component :is="formComponent" v-model="question" />
    <div class="form-control-footer">
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
  justify-content: flex-end;
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
