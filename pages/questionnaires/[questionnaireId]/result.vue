<script lang="ts" setup>
import QuestionnaireResult from '~/components/questionnaire-result/questionnaire-result.vue';
import DetailLoadingSkeleton from '~/components/ui/page-state/detail-loading-skeleton.vue';
import ErrorReloadPanel from '~/components/ui/page-state/error-reload-panel.vue';
import {
  useGetQuestionnaire,
  useGetQuestionnaireResponses,
} from '~/composables/type-fetch/anke-to/client';

const questionnaireId = useRouteQuestionnaireId();
const {
  data: questionnaire,
  error: questionnaireError,
  refresh: refreshQuestionnaire,
} = useGetQuestionnaire(questionnaireId);
const {
  data: responses,
  error: responsesError,
  refresh: refreshResponses,
} = useGetQuestionnaireResponses(questionnaireId);

const handleRetry = async () => {
  await Promise.all([refreshQuestionnaire(), refreshResponses()]);
};
</script>

<template>
  <div class="result-page-state">
    <ErrorReloadPanel
      v-if="questionnaireError || responsesError"
      title="アンケート結果の取得に失敗しました"
      :message="questionnaireError?.message || responsesError?.message"
      @retry="handleRetry"
    />
    <DetailLoadingSkeleton v-else-if="!questionnaire || !responses" />
    <QuestionnaireResult
      v-else
      :questionnaire="questionnaire"
      :responses="responses"
    />
  </div>
</template>

<style lang="scss" scoped>
.result-page-state {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
</style>
