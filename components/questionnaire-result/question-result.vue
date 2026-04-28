<script lang="ts" setup>
import type { QuestionResult } from '~/components/questionnaire-result/composables/use-questionnaire-result';
import MarkdownBlock from '~/components/ui/markdown/markdown-block.vue';
import MultipleChoiceResult from './questionnaire-result-element/multiple-choice-result.vue';
import NumberResult from './questionnaire-result-element/number-result.vue';
import ScaleResult from './questionnaire-result-element/scale-result.vue';
import SingleChoiceResult from './questionnaire-result-element/single-choice-result.vue';
import TextLongResult from './questionnaire-result-element/text-long-result.vue';
import TextResult from './questionnaire-result-element/text-result.vue';

const props = defineProps<{
  result: QuestionResult;
  index: number;
  total: number;
  isAnonymous: boolean;
  questionnaireId: number;
}>();

const hasResponses = computed(() => props.result.responses.length > 0);
const questionTypeLabelMap = {
  Text: '短文',
  TextLong: '長文',
  Number: '数値',
  SingleChoice: '単一選択',
  MultipleChoice: '複数選択',
  Scale: '評価',
} satisfies Record<QuestionResult['question_type'], string>;
</script>

<template>
  <section class="question-result-card">
    <div class="question-result-header">
      <div class="question-result-title-block">
        <p class="question-result-order">Q{{ index }} / {{ total }}</p>
        <div class="question-result-title">
          {{ result.title }}
        </div>
        <div class="question-result-meta-chips">
          <span class="question-result-chip" :class="result.is_required ? 'is-required' : 'is-optional'">
            {{ result.is_required ? '必須' : '任意' }}
          </span>
          <span class="question-result-chip is-type">
            {{ questionTypeLabelMap[result.question_type] }}
          </span>
        </div>
      </div>

      <span class="question-result-count">回答 {{ result.responses.length }} 件</span>
    </div>
    <MarkdownBlock class="question-result-description" :content="result.description" />

    <div v-if="!hasResponses" class="question-result-empty">
      <Icon name="mdi:message-outline" size="20px" />
      <span>この質問にはまだ回答がありません。</span>
    </div>

    <template v-else>
      <TextResult
        v-if="result.question_type === 'Text'"
        :result="result"
        :is-anonymous="props.isAnonymous"
        :questionnaire-id="props.questionnaireId"
      />
      <TextLongResult
        v-else-if="result.question_type === 'TextLong'"
        :result="result"
        :is-anonymous="props.isAnonymous"
        :questionnaire-id="props.questionnaireId"
      />
      <NumberResult
        v-else-if="result.question_type === 'Number'"
        :result="result"
        :is-anonymous="props.isAnonymous"
        :questionnaire-id="props.questionnaireId"
      />
      <SingleChoiceResult
        v-else-if="result.question_type === 'SingleChoice'"
        :result="result"
        :is-anonymous="props.isAnonymous"
        :questionnaire-id="props.questionnaireId"
      />
      <MultipleChoiceResult
        v-else-if="result.question_type === 'MultipleChoice'"
        :result="result"
        :is-anonymous="props.isAnonymous"
        :questionnaire-id="props.questionnaireId"
      />
      <ScaleResult
        v-else-if="result.question_type === 'Scale'"
        :result="result"
        :is-anonymous="props.isAnonymous"
        :questionnaire-id="props.questionnaireId"
      />
    </template>
  </section>
</template>

<style lang="scss" scoped>
.question-result-card {
  border: 1px solid var(--p-surface-200);
  border-radius: 12px;
  padding: 16px;
  background-color: var(--p-surface-0);
}

.question-result-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 12px;
  margin-bottom: 8px;
}

.question-result-title-block {
  flex: 1;
  min-width: 0;
}

.question-result-order {
  margin: 0 0 4px;
  font-size: 12px;
  font-weight: 700;
  color: var(--p-primary-700);
}

.question-result-title {
  font-weight: bold;
  font-size: 18px;
}

.question-result-meta-chips {
  margin-top: 6px;
  display: inline-flex;
  gap: 6px;
  flex-wrap: wrap;
}

.question-result-chip {
  display: inline-flex;
  align-items: center;
  border-radius: 999px;
  padding: 2px 8px;
  font-size: 11px;
  font-weight: 700;
}

.question-result-chip.is-required {
  background-color: color-mix(in srgb, var(--p-red-500) 16%, white);
  color: var(--p-red-800);
}

.question-result-chip.is-optional,
.question-result-chip.is-type {
  background-color: var(--p-surface-100);
  color: var(--p-text-secondary);
}

.question-result-count {
  white-space: nowrap;
  font-size: 12px;
  color: var(--p-text-secondary);
}

.question-result-description {
  margin-bottom: 16px;
  color: var(--p-surface-600);
  font-size: 14px;
}

.question-result-empty {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  border: 1px dashed var(--p-surface-300);
  border-radius: var(--p-border-radius-md);
  padding: 10px 12px;
  color: var(--p-text-secondary);
}
</style>
