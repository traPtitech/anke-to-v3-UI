<script lang="ts" setup>
import ButtonLink from '~/components/ui/button-link.vue';
import NewResponseForm from '~/components/response-form/new-response-form.vue';
import DetailLoadingIndicator from '~/components/ui/page-state/detail-loading-indicator.vue';
import ErrorStatePanel from '~/components/ui/page-state/error-state-panel.vue';
import { usePageSeo } from '~/composables/use-page-seo';
import {
  useGetQuestionnaire,
  useMe,
} from '~/composables/type-fetch/anke-to/client';

const questionnaireId = useRouteQuestionnaireId();
const { data, error } = useGetQuestionnaire(questionnaireId);
const { data: me } = useMe();

const cannotRespondReason = computed(() => {
  const questionnaire = data.value;
  if (questionnaire === undefined) {
    return undefined;
  }

  if (!questionnaire.is_published) {
    return 'このアンケートはまだ公開されていないため回答できません。';
  }

  const due = questionnaire.response_due_date_time;
  if (due !== undefined && new Date(due).getTime() < Date.now()) {
    return '回答期限を過ぎているため回答できません。';
  }

  const hasMyResponse = Array.isArray(questionnaire.respondents)
    ? questionnaire.respondents.includes(me.value?.name ?? '')
    : false;
  if (!questionnaire.is_duplicate_answer_allowed && hasMyResponse) {
    return 'すでに回答済みです。重複回答は許可されていないため、再度回答することができません。';
  }

  return undefined;
});

const canRespond = computed(() => cannotRespondReason.value === undefined);

usePageSeo({
  title: computed(() =>
    data.value ? `「${data.value.title}」に回答` : '読み込み中...',
  ),
  description: 'アンケートへの新規回答を作成します。',
});
</script>

<template>
  <ErrorStatePanel
    v-if="error"
    title="アンケートの取得に失敗しました"
    :message="error.message"
  />
  <div v-else-if="!data">
    <DetailLoadingIndicator variant="questionnaire" />
  </div>
  <div
    v-else-if="!canRespond"
    class="state-panel state-panel-warning"
    role="alert"
  >
    <Icon name="mdi:alert-outline" size="72px" class="state-panel-icon" />
    <p class="state-panel-title">現在このアンケートには回答できません</p>
    <p class="state-panel-message">
      {{ cannotRespondReason ?? '現在このアンケートには回答できません。' }}
    </p>
    <ButtonLink
      variant="secondary"
      :to="`/questionnaires/${questionnaireId}`"
      class="back-to-detail-link"
    >
      <Icon name="mdi:chevron-left" size="20px" />
      <span>アンケート詳細画面に戻る</span>
    </ButtonLink>
  </div>
  <NewResponseForm v-else :questionnaire="data" />
</template>

<style scoped lang="scss">
.state-panel {
  display: flex;
  flex-direction: column;
  gap: 12px;
  align-items: center;
  text-align: center;
  width: 100%;
  max-width: 800px;
  margin: 16px auto;
  padding: 20px;
  border-radius: 12px;
  background-color: var(--p-surface-0);
}

.state-panel-warning {
  border: 1px solid var(--p-surface-300);
  color: var(--p-text-color);
}

.state-panel-title {
  margin: 0;
  font-weight: 700;
  font-size: 20px;
  line-height: 1.4;
}

.state-panel-message {
  margin: 0;
  line-height: 1.7;
  color: var(--p-text-muted-color);
}

.cannot-respond-message {
  color: inherit;
}

:deep(.back-to-detail-link) {
  margin-top: 1.5rem;
}
</style>
