<script lang="ts" setup>
import type { QuestionResult } from '~/components/questionnaire-result/composables/use-questionnaire-result';

const props = defineProps<{
  result: QuestionResult;
  isAnonymous: boolean;
}>();
</script>

<template>
  <QuestionnaireContainer>
    <div class="question-result-title">
      {{ result.title }}
    </div>
    <div class="question-result-description">
      {{ result.description }}
    </div>
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
.question-result-title {
  font-weight: bold;
  font-size: 20px;
}

.question-result-description {
  margin-bottom: 16px;
}
</style>
