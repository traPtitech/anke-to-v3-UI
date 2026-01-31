<script lang="ts" setup>
import ButtonLink from '~/components/ui/button-link.vue';
import type { GatewayQuestionnaireSummary } from '~/models/questionnaire';
import {
  checkIsDueOver,
  formatResponseDueDateTime,
} from '~/models/questionnaire';

const props = defineProps<{
  questionnaires: GatewayQuestionnaireSummary[];
}>();
</script>

<template>
  <div>
    <div
      v-for="questionnaire in props.questionnaires"
      :key="questionnaire.questionnaire_id"
      class="questionnaire-card"
    >
      <div class="questionnaire-card-title-container">
        <NuxtLink
          class="questionnaire-card-title"
          :to="`/questionnaires/${questionnaire.questionnaire_id}`"
        >
          {{ questionnaire.title }}
        </NuxtLink>
        <div class="questionnaire-card-tip-section">
          <div v-if="questionnaire.is_published" class="questionnaire-card-tip">
            <Icon name="mdi:alarm" size="20px" />
            <span>
              {{ formatResponseDueDateTime(questionnaire) }}
            </span>
          </div>
        </div>
      </div>

      <div class="questionnaire-card-description">
        {{ questionnaire.description }}
      </div>

      <div class="questionnaire-card-action-section">
        <ButtonLink
          :to="`/questionnaires/${questionnaire.questionnaire_id}/edit`"
        >
          <Icon name="mdi:square-edit-outline" size="24px" />
          <span>アンケートを編集</span>
        </ButtonLink>
        <ButtonLink
          v-if="questionnaire.is_published && questionnaire"
          :to="`/questionnaires/${questionnaire.questionnaire_id}/result`"
        >
          <Icon name="mdi:forum-outline" size="24px" />
          <span>結果を確認</span>
        </ButtonLink>
        <ButtonLink
          v-if="questionnaire.has_my_response && !checkIsDueOver(questionnaire)"
        >
          <Icon name="mdi:text-box-edit-outline" size="24px" />
          <span>回答を編集 (?)</span>
        </ButtonLink>
        <ButtonLink
          v-if="
            questionnaire.is_published &&
            !questionnaire.has_my_response &&
            !checkIsDueOver(questionnaire)
          "
          :to="`/questionnaires/${questionnaire.questionnaire_id}/responses/new`"
        >
          <Icon name="mdi:form-select" size="24px" />
          <span>アンケートに回答</span>
        </ButtonLink>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.questionnaire-card {
  border: 1px solid var(--p-surface-300);
  border-radius: var(--p-border-radius-md);
  padding: 16px;
  margin: 16px 0;
}

.questionnaire-card-title-container {
  display: flex;
  justify-content: space-between;
  gap: 4px;
}

.questionnaire-card-title {
  min-width: 0;
  flex: 1;
  font-weight: bold;
  font-size: 18px;
  color: variables.$color-primary;
  margin-bottom: 8px;
  text-decoration: none;

  overflow: hidden;
  display: -webkit-box;
  text-overflow: ellipsis;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  max-height: 56px;
}

.questionnaire-card-title:hover {
  text-decoration: underline;
}

.questionnaire-card-tip-section {
  display: flex;
  gap: 4px;
}

.questionnaire-card-description {
  overflow: hidden;
  display: -webkit-box;
  text-overflow: ellipsis;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
  max-height: 72px;
}

.questionnaire-card-action-section {
  display: flex;
  justify-content: flex-end;
  margin-top: 16px;
  gap: 16px;
}
</style>
