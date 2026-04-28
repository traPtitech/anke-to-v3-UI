<script lang="ts" setup>
import ResponseDetail from '~/components/response-detail/response-detail.vue';
import DetailLoadingIndicator from '~/components/ui/page-state/detail-loading-indicator.vue';
import ErrorStatePanel from '~/components/ui/page-state/error-state-panel.vue';
import { usePageSeo } from '~/composables/use-page-seo';
import { useGetResponseWithQuestionnaire } from '~/composables/type-fetch/anke-to/client';

const responseId = useRouteResponseId();
const { response, responseError, questionnaire, questionnaireError, refresh } =
  useGetResponseWithQuestionnaire(responseId);

usePageSeo({
  title: computed(() => (questionnaire.value ? `「${questionnaire.value.title}」への回答` : '読み込み中...')),
  description: '回答内容の詳細を確認できます。',
});
</script>

<template>
  <div class="response-page-state">
    <ErrorStatePanel
      v-if="responseError || questionnaireError"
      title="回答の取得に失敗しました"
      :message="responseError?.message || questionnaireError?.message"
      :show-retry="true"
      @retry="refresh"
    />
    <DetailLoadingIndicator v-else-if="!questionnaire || !response" variant="response" />
    <ResponseDetail v-else :questionnaire="questionnaire" :response="response" />
  </div>
</template>

<style lang="scss" scoped>
.response-page-state {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
</style>
