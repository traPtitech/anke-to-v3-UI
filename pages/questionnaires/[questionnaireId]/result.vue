<script lang="ts" setup>
import QuestionnaireResult from '~/components/questionnaire-result/questionnaire-result.vue';
import DetailLoadingIndicator from '~/components/ui/page-state/detail-loading-indicator.vue';
import ErrorReloadPanel from '~/components/ui/page-state/error-reload-panel.vue';
import { usePageSeo } from '~/composables/use-page-seo';
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

usePageSeo({
  title: computed(() =>
    questionnaire.value
      ? `「${questionnaire.value.title}」の結果`
      : '読み込み中...',
  ),
  description: 'アンケートの集計結果と回答一覧を確認できます。',
});

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
    <DetailLoadingIndicator
      v-else-if="!questionnaire || !responses"
      variant="questionnaire"
    />
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
