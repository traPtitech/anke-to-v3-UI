<script lang="ts" setup>
import { Container, Draggable } from 'vue3-smooth-dnd';
import type { QuestionSettingsMultipleChoice } from '~/components/new-questionnaire-form/type';

const props = defineProps<{
  modelValue: QuestionSettingsMultipleChoice['options'];
}>();

const emit = defineEmits<{
  (
    e: 'update:modelValue',
    value: QuestionSettingsMultipleChoice['options'],
  ): void;
}>();

type InternalOption = {
  id: number;
  label: string;
};

const toInternal = (
  value: QuestionSettingsMultipleChoice['options'],
): InternalOption[] =>
  value.map((option) => ({
    id: createId(),
    label: option,
  }));

const fromInternal = (
  value: InternalOption[],
): QuestionSettingsMultipleChoice['options'] =>
  value.map((option) => option.label);

const internalOptions = ref<InternalOption[]>(toInternal(props.modelValue));

watch(
  () => props.modelValue,
  (newValue) => {
    internalOptions.value = toInternal(newValue);
  },
);

watch(internalOptions, (newValue) => {
  const externalValue = fromInternal(newValue);
  if (
    externalValue.length === props.modelValue.length &&
    externalValue.every((v, i) => v === props.modelValue[i])
  )
    return;

  emit('update:modelValue', externalValue);
});

const containerRef = useTemplateRef('containerRef');

// 更新時のフォーカス移動
watch(
  () => internalOptions.value,
  (currentValue, prevValue) => {
    if (prevValue === undefined) {
      containerRef.value
        ?.querySelectorAll<HTMLInputElement>('.choice-group-label-input')[0]
        ?.focus();
      return;
    }

    if (currentValue.length === prevValue.length) return;

    const newValueIndex = currentValue.findIndex(
      (c) => !prevValue.some((p) => p.id === c.id),
    );
    if (newValueIndex === -1) return;

    // すぐフォーカスを当てるとレンダリング前(?)にフォーカスが当たって思った要素にフォーカスが当たらない
    setTimeout(() => {
      containerRef.value
        ?.querySelectorAll<HTMLInputElement>('.choice-group-label-input')
        [newValueIndex]?.focus();
    }, 10);
  },
  { immediate: true },
);
</script>

<template>
  <div ref="containerRef">
    <Container
      drag-handle-selector=".drag-handle"
      lock-axis="y"
      @drop="
        internalOptions = moveInArray(
          internalOptions,
          $event.removedIndex,
          $event.addedIndex,
        )
      "
    >
      <Draggable
        v-for="(option, index) in internalOptions"
        :key="option.id"
        class="choice-group-element"
      >
        <div class="drag-handle">
          <Icon
            size="24px"
            name="ic:outline-drag-indicator"
            class="drag-icon"
          />
        </div>
        <slot />
        <InputText
          :model-value="option.label"
          class="choice-group-label-input"
          required
          placeholder="選択肢"
          @update:model-value="
            internalOptions = replaceInArray(internalOptions, index, {
              ...option,
              label: $event ?? '',
            })
          "
          @keypress="
            if ($event.key === 'Enter') {
              internalOptions = insertToArray(internalOptions, index + 1, {
                id: createId(),
                label: '',
              });
            }
          "
        />
        <Button
          outlined
          class="delete-choice-button p-button-icon-only"
          @click="
            internalOptions = internalOptions.filter((o) => o.id !== option.id)
          "
        >
          <Icon size="24px" name="mdi:trash-can-outline" />
        </Button>
      </Draggable>
    </Container>
    <Button
      class="add-choice-button"
      outlined
      @click="
        internalOptions = internalOptions.concat({ id: createId(), label: '' })
      "
    >
      <Icon size="24px" name="mdi:plus" />
      <span>新しい選択肢を追加</span>
    </Button>
  </div>
</template>

<style lang="scss" scoped>
.delete-choice-button {
  border-color: #e6d6d6;
}

.add-choice-button {
  margin-top: 16px;
  width: 100%;
  font-weight: bold;
  display: flex;
  align-items: center;
  gap: 8px;
  justify-content: center;
}

/* smooth-dndのスタイルを上書きするために詳細度を上げる */
.choice-group-element.choice-group-element.choice-group-element {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 4px 0;
}

.drag-handle {
  cursor: move;
}

.drag-icon {
  color: #a38f91;
}

.choice-group-label-input {
  flex: 1;
}
</style>
