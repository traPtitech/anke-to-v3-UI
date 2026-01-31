<script lang="ts" setup>
import { Container, Draggable } from 'vue3-smooth-dnd';
import { useChoiceGroupFromControl } from './choice-group';

const options = defineModel<string[]>({ required: true });

const { internalOptions, addOption, updateOption, moveOption, removeOption } =
  useChoiceGroupFromControl(options);

const handleAddOption = async (index?: number) => {
  const id = addOption(index);
  const elementId = `choice-group-option-${id}`;
  await nextTick();
  const input = document.getElementById(elementId);
  input?.focus();
};

const focusByIndex = async (index: number) => {
  const option = internalOptions.value[index];
  if (!option) return;
  const elementId = `choice-group-option-${option.id}`;
  const input = document.getElementById(elementId);
  input?.focus();
};

const handleKeyPress = async (e: KeyboardEvent, index: number) => {
  if (e.key === 'Enter') {
    handleAddOption(index + 1);
  }
};
const handleKeyDown = (e: KeyboardEvent, index: number) => {
  if (e.key === 'ArrowUp' && index > 0) {
    focusByIndex(index - 1);
  }
  if (e.key === 'ArrowDown' && index < internalOptions.value.length - 1) {
    focusByIndex(index + 1);
  }
};
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
        <div class="drag-handle">
          <Icon
            size="24px"
            name="ic:outline-drag-indicator"
            class="drag-icon"
          />
        </div>
        <slot />
        <InputText
          :id="`choice-group-option-${option.id}`"
          :model-value="option.label"
          class="choice-group-label-input"
          required
          placeholder="選択肢"
          @update:model-value="updateOption(index, $event ?? '')"
          @keypress="handleKeyPress($event, index)"
          @keydown="handleKeyDown($event, index)"
        />
        <Button
          outlined
          class="delete-choice-button p-button-icon-only"
          @click="removeOption(index)"
        >
          <Icon size="24px" name="mdi:trash-can-outline" />
        </Button>
      </Draggable>
    </Container>
    <Button class="add-choice-button" outlined @click="handleAddOption()">
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
