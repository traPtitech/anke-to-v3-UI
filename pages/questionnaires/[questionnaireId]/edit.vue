<script lang="ts" setup>
import EditQuestionnaireForm from '~/components/questionnaire-form/edit-questionnaire-form.vue';
import DetailLoadingIndicator from '~/components/ui/page-state/detail-loading-indicator.vue';
import ErrorReloadPanel from '~/components/ui/page-state/error-reload-panel.vue';
import { usePageSeo } from '~/composables/use-page-seo';
import { useGetQuestionnaire } from '~/composables/type-fetch/anke-to/client';

const questionnaireId = useRouteQuestionnaireId();
const { data, error, refresh } = useGetQuestionnaire(questionnaireId);

usePageSeo({
  title: computed(() =>
    data.value ? `「${data.value.title}」を編集` : '読み込み中...',
  ),
  description: 'アンケートのタイトルや質問内容を編集します。',
});

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
    <DetailLoadingIndicator v-else-if="!data" variant="questionnaire" />
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
