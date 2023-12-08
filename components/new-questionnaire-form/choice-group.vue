<script lang="ts" setup>
import { Container, Draggable } from 'vue3-smooth-dnd';

const props = defineProps<{
  modelValue: QuestionSettingsMultipleChoice['options'];
}>();

defineEmits<{
  (
    e: 'update:modelValue',
    value: QuestionSettingsMultipleChoice['options'],
  ): void;
}>();

watch(
  () => props.modelValue,
  (currentValue, prevValue) => {
    if (!process.client) return;

    if (document === undefined) return;

    if (prevValue === undefined) {
      document
        .querySelectorAll<HTMLInputElement>('.choice-group-label-input')[0]
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
      document
        .querySelectorAll<HTMLInputElement>('.choice-group-label-input')
        [newValueIndex]?.focus();
    }, 10);
  },
  { immediate: true },
);
</script>

<template>
  <div>
    <div class="choice-group-container">
      <Container
        drag-handle-selector=".drag-handle"
        lock-axis="y"
        @drop="
          $emit(
            'update:modelValue',
            moveInArray(modelValue, $event.removedIndex, $event.addedIndex),
          )
        "
      >
        <Draggable
          v-for="(option, index) in modelValue"
          :key="option.id"
          class="choice-group-element"
        >
          <div class="drag-handle">
            <Icon
              name="ic:outline-drag-indicator"
              size="24px"
              class="drag-icon"
            />
          </div>
          <slot />
          <InputText
            :model-value="option.label"
            class="choice-group-label-input"
            placeholder="選択肢"
            @update:model-value="
              $emit(
                'update:modelValue',
                replaceInArray(modelValue, index, {
                  ...option,
                  label: $event,
                }),
              )
            "
            @keypress="
              if ($event.key === 'Enter') {
                $emit(
                  'update:modelValue',
                  insertToArray(modelValue, index + 1, {
                    id: createId(),
                    label: '',
                  }),
                );
              }
            "
          />
          <Button
            outlined
            class="delete-choice-button p-button-icon-only"
            @click="
              $emit(
                'update:modelValue',
                modelValue.filter((o) => o.id !== option.id),
              )
            "
          >
            <Icon name="mdi:trash-can-outline" size="24px" />
          </Button>
        </Draggable>
      </Container>
    </div>
    <Button
      class="add-choice-button"
      outlined
      @click="
        $emit(
          'update:modelValue',
          modelValue.concat({ id: createId(), label: '' }),
        )
      "
    >
      <Icon name="mdi:plus" size="24px" />
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

.choice-group-container {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

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
