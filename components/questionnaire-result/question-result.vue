<script lang="ts" setup>
import type { QuestionResult } from '~/components/questionnaire-result/composables/use-questionnaire-result';
import MarkdownBlock from '~/components/ui/markdown/markdown-block.vue';
import QuestionnaireContainer from '~/components/ui/questionnaire/container.vue';
import MultipleChoiceResult from './questionnaire-result-element/multiple-choice-result.vue';
import NumberResult from './questionnaire-result-element/number-result.vue';
import ScaleResult from './questionnaire-result-element/scale-result.vue';
import SingleChoiceResult from './questionnaire-result-element/single-choice-result.vue';
import TextLongResult from './questionnaire-result-element/text-long-result.vue';
import TextResult from './questionnaire-result-element/text-result.vue';

const props = defineProps<{
  result: QuestionResult;
  isAnonymous: boolean;
}>();
</script>

<template>
  <QuestionnaireContainer>
    <div class="question-result-header">
      <div class="question-result-title">
        {{ result.title }}
      </div>
    </div>
    <MarkdownBlock
      class="question-result-description"
      :content="result.description"
    />
    <TextResult
      v-if="result.question_type === 'Text'"
      :result="result"
      :is-anonymous="props.isAnonymous"
    />
    <TextLongResult
      v-else-if="result.question_type === 'TextLong'"
      :result="result"
      :is-anonymous="props.isAnonymous"
    />
    <NumberResult
      v-else-if="result.question_type === 'Number'"
      :result="result"
      :is-anonymous="props.isAnonymous"
    />
    <SingleChoiceResult
      v-else-if="result.question_type === 'SingleChoice'"
      :result="result"
      :is-anonymous="props.isAnonymous"
    />
    <MultipleChoiceResult
      v-else-if="result.question_type === 'MultipleChoice'"
      :result="result"
      :is-anonymous="props.isAnonymous"
    />
    <ScaleResult
      v-else-if="result.question_type === 'Scale'"
      :result="result"
      :is-anonymous="props.isAnonymous"
    />
  </QuestionnaireContainer>
</template>

<style lang="scss" scoped>
.question-result-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 12px;
  margin-bottom: 8px;
}

.question-result-title {
  font-weight: bold;
  font-size: 18px;
  flex: 1;
}

.question-result-description {
  margin-bottom: 16px;
  color: var(--p-surface-600);
  font-size: 14px;
}
</style>
