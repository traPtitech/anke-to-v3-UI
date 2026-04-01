<script lang="ts" setup>
import { Container, Draggable } from 'vue3-smooth-dnd';
import { useChoiceGroupFromControl } from './choice-group';

const props = defineProps<{
  showChoiceOptionRequiredError?: boolean;
}>();

const options = defineModel<string[]>({ required: true });

const { internalOptions, updateOption, moveOption, removeOption } =
  useChoiceGroupFromControl(options);

const focusedOptionIds = ref(new Set<number>());

const focusByIndex = async (index: number) => {
  const option = internalOptions.value[index];
  if (!option) return;
  const elementId = `choice-group-option-${option.id}`;
  const input = document.getElementById(elementId);
  input?.focus();
};

const handleKeyDown = (e: KeyboardEvent, index: number) => {
  if (e.key === 'ArrowUp' && index > 0) {
    focusByIndex(index - 1);
  }
  if (e.key === 'ArrowDown' && index < internalOptions.value.length - 1) {
    focusByIndex(index + 1);
  }
};

const isLastOption = (index: number) =>
  index === internalOptions.value.length - 1;

const handleOptionFocus = (optionId: number) => {
  focusedOptionIds.value.add(optionId);
};

const handleOptionBlur = (optionId: number) => {
  focusedOptionIds.value.delete(optionId);
};

const showOptionRequiredError = (
  label: string,
  optionId: number,
  index: number,
) =>
  label.trim() === '' &&
  index < internalOptions.value.length - 1 &&
  !focusedOptionIds.value.has(optionId);

const isDuplicateOption = (label: string, index: number) => {
  const trimmedLabel = label.trim();
  if (trimmedLabel === '') return false;

  for (let i = 0; i < index; i += 1) {
    if (internalOptions.value[i]?.label.trim() === trimmedLabel) {
      return true;
    }
  }

  return false;
};

const showOptionDuplicateError = (
  label: string,
  optionId: number,
  index: number,
) => isDuplicateOption(label, index) && !focusedOptionIds.value.has(optionId);

const showChoiceCountRequiredError = (optionId: number, index: number) =>
  props.showChoiceOptionRequiredError &&
  options.value.length === 0 &&
  index === internalOptions.value.length - 1 &&
  !focusedOptionIds.value.has(optionId);
</script>

<template>
  <div>
    <Container
      drag-handle-selector=".drag-handle"
      lock-axis="y"
      @drop="moveOption($event.removedIndex, $event.addedIndex)"
    >
      <Draggable
        v-for="(option, index) in internalOptions"
        :key="option.id"
        class="choice-group-element"
      >
        <div class="choice-group-row">
          <div class="choice-group-leading-cell">
            <div v-if="!isLastOption(index)" class="drag-handle">
              <Icon
                size="24px"
                name="ic:outline-drag-indicator"
                class="drag-icon"
              />
            </div>
            <div v-else class="dummy-spacer" />
          </div>
          <div
            class="choice-group-slot"
            :class="{ 'is-dummy': isLastOption(index) }"
          >
            <slot />
          </div>
          <div class="choice-group-input-area">
            <InputText
              :id="`choice-group-option-${option.id}`"
              :model-value="option.label"
              class="choice-group-label-input"
              :class="{
                'p-invalid':
                  (showOptionRequiredError(option.label, option.id, index) ||
                    showOptionDuplicateError(option.label, option.id, index) ||
                    showChoiceCountRequiredError(option.id, index)) &&
                  !isLastOption(index),
                'is-dummy': isLastOption(index),
              }"
              required
              :placeholder="
                isLastOption(index) ? '選択肢を追加' : `選択肢 ${index + 1}`
              "
              @update:model-value="updateOption(index, $event ?? '')"
              @focus="handleOptionFocus(option.id)"
              @blur="handleOptionBlur(option.id)"
              @keydown="handleKeyDown($event, index)"
            />
          </div>
          <div class="choice-group-trailing-cell">
            <Button
              v-if="!isLastOption(index)"
              outlined
              class="delete-choice-button p-button-icon-only"
              @click="removeOption(index)"
            >
              <Icon size="24px" name="mdi:trash-can-outline" />
            </Button>
            <div v-else class="dummy-spacer" />
          </div>
          <small
            v-if="showOptionRequiredError(option.label, option.id, index)"
            class="invalid-message"
          >
            <Icon name="mdi:alert-circle" size="18px" />
            <span>選択肢を入力してください</span>
          </small>
          <small
            v-else-if="showOptionDuplicateError(option.label, option.id, index)"
            class="invalid-message"
          >
            <Icon name="mdi:alert-circle" size="18px" />
            <span>選択肢が重複しています</span>
          </small>
          <small
            v-else-if="showChoiceCountRequiredError(option.id, index)"
            class="invalid-message"
          >
            <Icon name="mdi:alert-circle" size="18px" />
            <span>選択肢を追加してください</span>
          </small>
        </div>
      </Draggable>
    </Container>
  </div>
</template>

<style lang="scss" scoped>
.delete-choice-button {
  border-color: #e6d6d6;
}

/* smooth-dndのスタイルを上書きするために詳細度を上げる */
.choice-group-element.choice-group-element.choice-group-element {
  padding: 4px 0;
}

.choice-group-row {
  display: grid;
  grid-template-columns: auto auto minmax(0, 1fr) auto;
  grid-template-areas:
    'leading slot input trailing'
    '. . message .';
  column-gap: 8px;
  row-gap: 4px;
  align-items: center;
}

.choice-group-leading-cell {
  grid-area: leading;
  display: flex;
  align-items: center;
}

.choice-group-slot {
  grid-area: slot;
  display: flex;
  align-items: center;
}

.drag-handle {
  cursor: move;
  flex-shrink: 0;
}

.drag-icon {
  color: #a38f91;
}

.dummy-spacer {
  width: 24px;
  flex-shrink: 0;
}

.choice-group-label-input {
  width: 100%;
}

.choice-group-slot.is-dummy {
  opacity: 0.6;
}

.choice-group-label-input.is-dummy {
  opacity: 0.7;
  color: #999;
}

.choice-group-input-area {
  grid-area: input;
  min-width: 0;
  display: flex;
  flex-direction: column;
}

.choice-group-input-area.has-invalid-message {
  align-self: start;
}

.choice-group-trailing-cell {
  grid-area: trailing;
  display: flex;
  align-items: center;
}

.invalid-message {
  grid-area: message;
  display: flex;
  align-items: center;
  gap: 4px;
  color: var(--p-red-500);
}
</style>
