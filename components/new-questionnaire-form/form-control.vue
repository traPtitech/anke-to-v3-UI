<script lang="ts" setup>
import MultipleChoiceInput from './multiple-choice-input.vue';
import NumberInput from './number-input.vue';
import ScaleInput from './scale-input.vue';
import SingleChoiceInput from './single-choice-input.vue';
import TextInput from './text-input.vue';
import TextLongInput from './text-long-input.vue';

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
  text: TextInput,
  'text-long': TextLongInput,
  'multiple-choice': MultipleChoiceInput,
  'single-choice': SingleChoiceInput,
  number: NumberInput,
  scale: ScaleInput,
} satisfies Record<QuestionSettings['type'], unknown>;

const formComponent = computed(() => formComponents[question.value.type]);
</script>

<template>
  <div class="form-control-container">
    <InputText
      v-model="question.title"
      size="large"
      placeholder="質問"
      class="form-control-title"
    />
    <Textarea
      v-model="question.description"
      placeholder="詳細な説明 (省略可)"
      class="form-control-description"
    />

    <component :is="formComponent" v-model="question" />
    <div class="form-control-footer">
      <div class="form-control-required-switch">
        <label>必須</label>
        <InputSwitch v-model="question.required"></InputSwitch>
      </div>
      <div class="form-control-footer-buttons">
        <Button
          class="p-button-icon-only p-button-text"
          title="質問を複製"
          @click="$emit('copy')"
        >
          <Icon name="mdi:content-copy" size="24px" />
        </Button>
        <Button
          class="p-button-icon-only p-button-text"
          title="質問を削除"
          @click="$emit('delete')"
        >
          <Icon name="mdi:trash-can-outline" size="24px" />
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
  border: 1px solid var(--surface-d);
  border-radius: var(--border-radius);
  padding: 16px;
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
