<script lang="ts" setup>
import QuestionnaireDetail from '~/components/questionnaire-detail/questionnaire-detail.vue';
import DetailLoadingSkeleton from '~/components/ui/page-state/detail-loading-skeleton.vue';
import ErrorReloadPanel from '~/components/ui/page-state/error-reload-panel.vue';
import { useGetQuestionnaire } from '~/composables/type-fetch/anke-to/client';

const questionnaireId = useRouteQuestionnaireId();
const { data, error, refresh } = useGetQuestionnaire(questionnaireId);

const handleRetry = async () => {
  await refresh();
};
</script>

<template>
  <div class="detail-page-state">
    <ErrorReloadPanel
      v-if="error"
      title="アンケート詳細の取得に失敗しました"
      :message="error.message"
      @retry="handleRetry"
    />
    <DetailLoadingSkeleton
      v-else-if="data === undefined"
      variant="questionnaire"
    />
    <QuestionnaireDetail v-else :detail="data" />
  </div>
</template>

<style scoped lang="scss">
.detail-page-state {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
</style>
