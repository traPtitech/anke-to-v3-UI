<script lang="ts" setup>
import QuestionnaireDetail from '~/components/questionnaire-detail/questionnaire-detail.vue';
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
  data: myResponses,
  error: myResponsesError,
  refresh: refreshMyResponses,
} = useGetQuestionnaireResponses(questionnaireId, {
  onlyMyResponse: true,
});

usePageSeo({
  title: computed(() =>
    questionnaire.value ? questionnaire.value.title : '読み込み中...',
  ),
  description: 'アンケートの詳細・回答状況・各種操作を確認できます。',
});

const handleRetry = async () => {
  await Promise.all([refreshQuestionnaire(), refreshMyResponses()]);
};
</script>

<template>
  <div class="detail-page-state">
    <ErrorReloadPanel
      v-if="questionnaireError || myResponsesError"
      title="アンケート詳細の取得に失敗しました"
      :message="questionnaireError?.message || myResponsesError?.message"
      @retry="handleRetry"
    />
    <DetailLoadingIndicator
      v-else-if="questionnaire === undefined || myResponses === undefined"
      variant="questionnaire"
    />
    <QuestionnaireDetail
      v-else
      :detail="questionnaire"
      :my-responses="myResponses"
    />
  </div>
</template>

<style scoped lang="scss">
.detail-page-state {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
</style>
