<script lang="ts" setup>
import type { QuestionSettings } from './type';

defineEmits<{
  (e: 'add-question', type: QuestionSettings['question_type']): void;
}>();
</script>

<template>
  <Panel header="新しい質問を追加する">
    <div class="add-question-buttons">
      <Button
        class="add-question-button"
        outlined
        @click="$emit('add-question', 'Text')"
      >
        <Icon size="24px" name="ic:outline-short-text" />
        <span>1行テキスト</span>
      </Button>
      <Button
        class="add-question-button"
        outlined
        @click="$emit('add-question', 'TextLong')"
      >
        <Icon size="24px" name="mdi:text" />
        <span>長文テキスト</span>
      </Button>
      <Button
        class="add-question-button"
        outlined
        @click="$emit('add-question', 'Number')"
      >
        <Icon size="24px" name="mdi:numeric" />
        <span>数値</span>
      </Button>
      <Button
        class="add-question-button"
        outlined
        @click="$emit('add-question', 'MultipleChoice')"
      >
        <Icon size="24px" name="mdi:checkbox-outline" />
        <span>チェックボックス</span>
      </Button>
      <Button
        class="add-question-button"
        outlined
        @click="$emit('add-question', 'SingleChoice')"
      >
        <Icon size="24px" name="mdi:radiobox-marked" />
        <span>ラジオボタン</span>
      </Button>
      <Button
        class="add-question-button"
        outlined
        @click="$emit('add-question', 'Scale')"
      >
        <Icon size="24px" name="ic:outline-linear-scale" />
        <span>目盛り</span>
      </Button>
    </div>
  </Panel>
</template>

<style lang="scss" scoped>
.add-question-buttons {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}

@media screen and (max-width: $breakpoint-lg) {
  .add-question-buttons {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media screen and (max-width: 620px) {
  .add-question-buttons {
    grid-template-columns: 1fr;
  }
}

.add-question-button {
  display: flex;
  gap: 8px;
  padding: 8px 12px;
}
</style>
