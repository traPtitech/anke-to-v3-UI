<script lang="ts" setup>
import EditQuestionnaireForm from '~/components/questionnaire-form/edit-questionnaire-form.vue';
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
  <div class="edit-page-state">
    <ErrorReloadPanel
      v-if="error"
      title="アンケート編集データの取得に失敗しました"
      :message="error.message"
      @retry="handleRetry"
    />
    <DetailLoadingSkeleton v-else-if="!data" variant="questionnaire" />
    <EditQuestionnaireForm v-else :questionnaire="data" />
  </div>
</template>

<style scoped lang="scss">
.edit-page-state {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
</style>
