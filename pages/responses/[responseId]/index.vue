<script lang="ts" setup>
import ResponseDetail from '~/components/response-detail/response-detail.vue';
import DetailLoadingIndicator from '~/components/ui/page-state/detail-loading-indicator.vue';
import ErrorReloadPanel from '~/components/ui/page-state/error-reload-panel.vue';
import { usePageSeo } from '~/composables/use-page-seo';
import {
  useGetQuestionnaire,
  useGetResponse,
} from '~/composables/type-fetch/anke-to/client';

const responseId = useRouteResponseId();
const {
  data: response,
  error: responseError,
  refresh: refreshResponse,
} = useGetResponse(responseId);

const questionnaireRequest = computed(() => {
  const questionnaireId = response.value?.questionnaire_id;
  if (!questionnaireId) {
    return null;
  }
  return useGetQuestionnaire(questionnaireId);
});

const questionnaire = computed(
  () => questionnaireRequest.value?.data.value ?? null,
);
const questionnaireError = computed(
  () => questionnaireRequest.value?.error.value ?? null,
);

usePageSeo({
  title: computed(() =>
    questionnaire.value
      ? `回答詳細: ${questionnaire.value.title}`
      : `回答詳細 #${responseId}`,
  ),
  description: '回答内容の詳細を確認できます。',
});

const handleRetry = async () => {
  await refreshResponse();
  if (questionnaireRequest.value) {
    await questionnaireRequest.value.refresh();
  }
};
</script>

<template>
  <div class="response-page-state">
    <ErrorReloadPanel
      v-if="responseError || questionnaireError"
      title="回答の取得に失敗しました"
      :message="responseError?.message || questionnaireError?.message"
      @retry="handleRetry"
    />
    <DetailLoadingIndicator
      v-else-if="!questionnaire || !response"
      variant="response"
    />
    <ResponseDetail
      v-else
      :questionnaire="questionnaire"
      :response="response"
    />
  </div>
</template>

<style lang="scss" scoped>
.response-page-state {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
</style>
