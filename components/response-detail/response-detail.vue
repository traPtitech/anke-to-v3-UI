<script lang="ts" setup>
import ButtonLink from '~/components/ui/button-link.vue';
import QuestionElement from '~/components/ui/question-element/question-element.vue';
import type { GatewayQuestionnaire } from '~/models/questionnaire';
import type { GatewayResponse } from '~/models/response';
import { useResponseBodies } from './composables/use-question-responses';

const props = withDefaults(
  defineProps<{
    questionnaire: GatewayQuestionnaire;
    response: GatewayResponse;
    backTo?: string;
    backLabel?: string;
    showBackNavigation?: boolean;
    showEditAction?: boolean;
  }>(),
  {
    backLabel: 'アンケート詳細画面に戻る',
    showBackNavigation: true,
    showEditAction: true,
  },
);

const { bodies } = useResponseBodies(props.questionnaire, props.response);

const isDraft = computed(() => props.response.is_draft);
const isDueOver = computed(() => {
  const due = props.questionnaire.response_due_date_time;
  if (due === undefined) {
    return false;
  }

  return new Date(due).getTime() < Date.now();
});

const resolvedBackTo = computed(
  () =>
    props.backTo ?? `/questionnaires/${props.questionnaire.questionnaire_id}`,
);
</script>

<template>
  <div class="response-detail-container">
    <div v-if="props.showBackNavigation" class="response-detail-nav">
      <ButtonLink variant="secondary" :to="resolvedBackTo">
        <Icon name="mdi:chevron-left" size="24px" />
        <span>{{ props.backLabel }}</span>
      </ButtonLink>
    </div>

    <div class="response-detail-title-row">
      <div class="response-detail-title-area">
        <div class="response-detail-badge-row">
          <span v-if="isDraft" class="response-badge response-badge-draft">
            <Icon name="mdi:file-document-edit-outline" size="14px" />
            下書き
          </span>
          <span v-else class="response-badge response-badge-submitted">
            <Icon name="mdi:check-circle-outline" size="14px" />
            回答済み
          </span>
        </div>
        <h1 class="response-detail-title">{{ questionnaire.title }}</h1>
      </div>
    </div>

    <div class="question-elements">
      <QuestionElement
        v-for="(body, index) in bodies"
        :key="index"
        :model-value="body"
        :mode="'view'"
      />
    </div>

    <div v-if="props.showEditAction" class="response-detail-footer">
      <ButtonLink
        v-if="!isDueOver"
        variant="primary"
        :to="`/responses/${response.response_id}/edit`"
      >
        <Icon name="mdi:pencil" size="18px" />
        <span>{{ isDraft ? '回答を続ける' : '編集する' }}</span>
      </ButtonLink>
      <small v-else class="response-edit-note">
        回答期限を過ぎているため、この回答は編集できません。
      </small>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.response-detail-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
  padding-bottom: 24px;
}

.response-detail-nav {
  display: flex;
  align-items: center;
}

.response-detail-title-row {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  padding: 24px 28px;
  border-radius: 12px;
  border: 1px solid var(--p-surface-200);
  background-color: var(--p-surface-0);
}

.response-detail-title-area {
  display: flex;
  flex-direction: column;
  gap: 8px;
  min-width: 0;
}

.response-detail-badge-row {
  display: flex;
  gap: 6px;
}

.response-badge {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 3px 10px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 600;
}

.response-badge-draft {
  background-color: var(--p-primary-500);
  color: white;
}

.response-badge-submitted {
  background-color: color-mix(in srgb, var(--p-green-500) 15%, white);
  color: var(--p-green-700);
  border: 1px solid var(--p-green-200);
}

.response-detail-title {
  font-size: 22px;
  font-weight: 700;
  color: var(--p-text-color);
  margin: 0;
  line-height: 1.4;
}

.response-edit-button {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  gap: 6px;
  white-space: nowrap;
}

.question-elements {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.response-detail-footer {
  display: flex;
  justify-content: flex-end;
  padding-top: 8px;
}

.response-edit-note {
  color: var(--p-text-muted-color);
}

@media screen and (max-width: 600px) {
  .response-detail-title-row {
    flex-direction: column;
    padding: 20px;
  }

  .response-edit-button {
    width: 100%;
    justify-content: center;
  }
}
</style>
