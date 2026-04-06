<script lang="ts" setup>
import EditResponseForm from '~/components/response-form/edit-response-form.vue';
import DetailLoadingSkeleton from '~/components/ui/page-state/detail-loading-skeleton.vue';
import ErrorReloadPanel from '~/components/ui/page-state/error-reload-panel.vue';
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

const handleRetry = async () => {
  await refreshResponse();
  if (questionnaireRequest.value) {
    await questionnaireRequest.value.refresh();
  }
};
</script>

<template>
  <div class="response-edit-page-state">
    <ErrorReloadPanel
      v-if="responseError || questionnaireError"
      title="回答編集データの取得に失敗しました"
      :message="responseError?.message || questionnaireError?.message"
      @retry="handleRetry"
    />
    <DetailLoadingSkeleton
      v-else-if="!questionnaire || !response"
      variant="response"
    />
    <EditResponseForm
      v-else
      :questionnaire="questionnaire"
      :response="response"
    />
  </div>
</template>

<style lang="scss" scoped>
.response-edit-page-state {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
</style>
