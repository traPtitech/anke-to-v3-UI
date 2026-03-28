<script lang="ts" setup>
import QuestionnaireRespondentsContainer from '~/components/ui/questionnaire/respondents-container.vue';
import ResultTitleContainer from '~/components/ui/questionnaire/result-title-container.vue';
import type { GatewayQuestionnaire } from '~/models/questionnaire';
import type { GatewayResponse } from '~/models/response';
import { useQuestionnaireResult } from './composables/use-questionnaire-result';
import QuestionResult from './question-result.vue';

const props = defineProps<{
  questionnaire: GatewayQuestionnaire;
  responses: GatewayResponse[];
}>();

const { results } = useQuestionnaireResult(
  props.questionnaire,
  props.responses,
);
</script>

<template>
  <div class="questionnaire-result-container">
    <div class="result-header">
      <Button
        class="p-button-icon-only"
        variant="text"
        @click="
          $router.push(
            `/questionnaires/${props.questionnaire.questionnaire_id}`,
          )
        "
      >
        <Icon name="mdi:chevron-left" size="24px" />
      </Button>
    </div>
    <ResultTitleContainer :questionnaire="props.questionnaire" />
    <QuestionnaireRespondentsContainer :questionnaire="props.questionnaire" />
    <QuestionResult
      v-for="(result, i) in results"
      :key="i"
      :result="result"
      :is-anonymous="props.questionnaire.is_anonymous"
    />
  </div>
</template>

<style lang="scss" scoped>
.questionnaire-result-container {
  display: flex;
  flex-direction: column;
  gap: 16px;
  max-width: 1080px;
  margin: 0 auto;
  padding-bottom: 50vh;
}

.result-header {
  display: flex;
  align-items: center;
}
</style>
