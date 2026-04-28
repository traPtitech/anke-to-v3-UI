<script lang="ts" setup>
import type { QuestionSettings } from './type';

defineEmits<{
  (e: 'add-question', type: QuestionSettings['question_type']): void;
}>();
</script>

<template>
  <div class="add-question-toolbar">
    <p class="add-question-toolbar-label">+ 質問を追加</p>
    <div class="add-question-buttons">
      <Button class="add-question-button" outlined size="small" @click="$emit('add-question', 'Text')">
        <Icon size="18px" name="ic:outline-short-text" />
        <span>1行テキスト</span>
      </Button>
      <Button class="add-question-button" outlined size="small" @click="$emit('add-question', 'TextLong')">
        <Icon size="18px" name="mdi:text" />
        <span>長文テキスト</span>
      </Button>
      <Button class="add-question-button" outlined size="small" @click="$emit('add-question', 'Number')">
        <Icon size="18px" name="mdi:numeric" />
        <span>数値</span>
      </Button>
      <Button class="add-question-button" outlined size="small" @click="$emit('add-question', 'MultipleChoice')">
        <Icon size="18px" name="mdi:checkbox-outline" />
        <span>チェックボックス</span>
      </Button>
      <Button class="add-question-button" outlined size="small" @click="$emit('add-question', 'SingleChoice')">
        <Icon size="18px" name="mdi:radiobox-marked" />
        <span>ラジオボタン</span>
      </Button>
      <Button class="add-question-button" outlined size="small" @click="$emit('add-question', 'Scale')">
        <Icon size="18px" name="ic:outline-linear-scale" />
        <span>目盛り</span>
      </Button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.add-question-toolbar {
  display: flex;
  flex-direction: column;
  gap: 10px;
  border: 1px solid var(--p-surface-300);
  border-radius: var(--p-border-radius-md);
  padding: 12px;
}

.add-question-toolbar-label {
  margin: 0;
  font-weight: bold;
}

.add-question-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.add-question-button {
  flex: 0 0 auto;
  display: flex;
  gap: 6px;
  padding: 4px 10px;
}
</style>
