<script lang="ts" setup>
import ResponseDetail from '~/components/response-detail/response-detail.vue';
import ButtonLink from '~/components/ui/button-link.vue';
import DetailLoadingIndicator from '~/components/ui/page-state/detail-loading-indicator.vue';
import ErrorStatePanel from '~/components/ui/page-state/error-state-panel.vue';
import { usePageSeo } from '~/composables/use-page-seo';
import {
  useGetQuestionnaire,
  useGetQuestionnaireResponses,
} from '~/composables/type-fetch/anke-to/client';

const route = useRoute();
const questionnaireId = useRouteQuestionnaireId();

const responseId = computed(() => {
  const parsed = Number(route.params.responseId);
  return Number.isNaN(parsed) ? null : parsed;
});

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

const responseIndex = computed(() => {
  if (responseId.value === null || !responses.value) {
    return -1;
  }

  return responses.value.findIndex(
    (response) => response.response_id === responseId.value,
  );
});

const response = computed(() => {
  if (responseIndex.value < 0 || !responses.value) {
    return null;
  }

  return responses.value[responseIndex.value] ?? null;
});

const totalResponses = computed(() => responses.value?.length ?? 0);

const paginatorFirst = computed(() => Math.max(0, responseIndex.value));

const toResultPagePath = computed(
  () => `/questionnaires/${questionnaireId}/result`,
);

const toResponsePath = (targetResponseId: number) =>
  `/questionnaires/${questionnaireId}/result/${targetResponseId}`;

const hasInvalidResponseId = computed(() => responseId.value === null);

const isResponseMissing = computed(
  () =>
    !hasInvalidResponseId.value &&
    !!responses.value &&
    !responsesError.value &&
    response.value === null,
);

const handlePageChange = (event: { page: number }) => {
  const targetResponseId = responses.value?.[event.page]?.response_id;
  if (
    targetResponseId === undefined ||
    targetResponseId === response.value?.response_id
  ) {
    return;
  }

  void navigateTo(toResponsePath(targetResponseId));
  window.scrollTo({ top: 0, behavior: 'auto' });
};

const handleRetry = async () => {
  await Promise.all([refreshQuestionnaire(), refreshResponses()]);
};

usePageSeo({
  title: computed(() => {
    if (!questionnaire.value) {
      return '読み込み中...';
    }

    if (responseIndex.value >= 0) {
      return `「${questionnaire.value.title}」の回答 ${responseIndex.value + 1}`;
    }

    return `「${questionnaire.value.title}」の回答`;
  }),
  description: 'アンケートの個別回答を確認できます。',
});
</script>

<template>
  <div class="result-response-page-state">
    <ErrorStatePanel
      v-if="questionnaireError || responsesError"
      title="回答の取得に失敗しました"
      :message="questionnaireError?.message || responsesError?.message"
      :show-retry="true"
      @retry="handleRetry"
    />

    <div
      v-else-if="hasInvalidResponseId || isResponseMissing"
      class="not-found"
    >
      <ErrorStatePanel
        title="回答が見つかりません"
        message="指定された回答は存在しないか、閲覧権限がありません。"
      />
      <ButtonLink variant="secondary" :to="toResultPagePath">
        <Icon name="mdi:chart-box-outline" size="20px" />
        <span>結果画面に戻る</span>
      </ButtonLink>
    </div>

    <DetailLoadingIndicator
      v-else-if="!questionnaire || !responses || !response"
      variant="response"
    />

    <div v-else class="result-response-page-content">
      <div class="result-response-navigation">
        <ButtonLink variant="secondary" :to="toResultPagePath">
          <Icon name="mdi:chevron-left" size="20px" />
          <span>結果画面に戻る</span>
        </ButtonLink>
        <Paginator
          :first="paginatorFirst"
          :rows="1"
          :total-records="totalResponses"
          template="PrevPageLink CurrentPageReport NextPageLink"
          current-page-report-template="回答 {currentPage} / {totalPages}"
          @page="handlePageChange"
        />
      </div>

      <ResponseDetail
        :questionnaire="questionnaire"
        :response="response"
        :show-back-navigation="false"
        :show-edit-action="false"
      />

      <div class="result-response-navigation">
        <ButtonLink variant="secondary" :to="toResultPagePath">
          <Icon name="mdi:chevron-left" size="20px" />
          <span>結果画面に戻る</span>
        </ButtonLink>

        <Paginator
          :first="paginatorFirst"
          :rows="1"
          :total-records="totalResponses"
          template="PrevPageLink CurrentPageReport NextPageLink"
          current-page-report-template="回答 {currentPage} / {totalPages}"
          @page="handlePageChange"
        />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.result-response-page-state {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.result-response-page-content {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.result-response-navigation {
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.not-found {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

@media screen and (max-width: 640px) {
  .result-response-navigation {
    justify-content: center;
    flex-direction: column;
    width: 100%;
  }

  .result-response-navigation :deep(.p-paginator) {
    width: 100%;
    justify-content: center;
  }
}
</style>
