<script lang="ts" setup>
import MarkdownBlock from '~/components/ui/markdown/markdown-block.vue';
import {
  useQuestionValidity,
  type QuestionElement,
  type QuestionElementMode,
} from './composables';
import QuestionElementMultipleChoice from './question-element-multiple-choice.vue';
import QuestionElementNumber from './question-element-number.vue';
import QuestionElementScale from './question-element-scale.vue';
import QuestionElementSingleChoice from './question-element-single-choice.vue';
import QuestionElementTextLong from './question-element-text-long.vue';
import QuestionElementText from './question-element-text.vue';

const props = defineProps<{
  mode: QuestionElementMode;
}>();

const question = defineModel<QuestionElement>({ required: true });
const { valid } = useQuestionValidity(question.value);
</script>

<template>
  <div class="question-element-container">
    <div class="question-element-header">
      <p class="question-element-title">
        <span class="question-element-title-main">
          {{ question.title }}
        </span>
        <span
          v-if="question.is_required"
          class="question-element-required-chip"
        >
          必須
        </span>
        <span v-else class="question-element-non-required-chip">任意</span>
      </p>
    </div>
    <MarkdownBlock
      class="question-element-description"
      :content="question.description"
    />

    <QuestionElementText
      v-if="question.question_type === 'Text'"
      v-model="question"
      :mode="props.mode"
    />
    <QuestionElementTextLong
      v-if="question.question_type === 'TextLong'"
      v-model="question"
      :mode="props.mode"
    />
    <QuestionElementNumber
      v-if="question.question_type === 'Number'"
      v-model="question"
      :mode="props.mode"
    />
    <QuestionElementSingleChoice
      v-if="question.question_type === 'SingleChoice'"
      v-model="question"
      :mode="props.mode"
    />
    <QuestionElementMultipleChoice
      v-if="question.question_type === 'MultipleChoice'"
      v-model="question"
      :mode="props.mode"
    />
    <QuestionElementScale
      v-if="question.question_type === 'Scale'"
      v-model="question"
      :mode="props.mode"
    />
    <p v-if="!valid" class="error-message">
      <small>回答必須の質問です</small>
    </p>
  </div>
</template>

<style lang="scss" scoped>
.question-element-container {
  padding: 20px 24px;
  border: 1px solid var(--p-surface-200);
  border-radius: 12px;
  background: color-mix(in srgb, var(--p-surface-0) 80%, var(--p-surface-50));
}

.question-element-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 12px;
  margin-bottom: 6px;
}

.question-element-title {
  font-size: 17px;
  font-weight: 700;
  color: var(--p-text-color);
  margin-bottom: 4px;
  line-height: 1.4;
}

.question-element-title-main {
  vertical-align: middle;
}

.question-element-required-chip,
.question-element-non-required-chip {
  vertical-align: middle;
  display: inline-block;
  padding: 2px 8px;
  border-radius: var(--p-border-radius-md);
  font-size: 11px;
  font-weight: 700;
  flex-shrink: 0;
  margin-left: 8px;
}

.question-element-required-chip {
  background-color: hsl(0, 62%, 50%);
  color: white;
}

.question-element-non-required-chip {
  background-color: var(--p-surface-200);
  color: var(--p-text-muted-color);
}

.question-element-description {
  font-size: 13px;
  color: var(--p-text-muted-color);
  margin-bottom: 16px;
  line-height: 1.6;
}

.error-message {
  margin-top: 8px;
  color: #f26451;
}
</style>
