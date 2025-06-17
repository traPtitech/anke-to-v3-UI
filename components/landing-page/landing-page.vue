<script lang="ts" setup>
import type { QuestionnaireSummary } from './type';

defineProps<{
  questionnaires: QuestionnaireSummary[];
  questionnairesDraft: QuestionnaireSummary[];
  questionnairesHasDraft: QuestionnaireSummary[];
  questionnairesTargetingMe: QuestionnaireSummary[];
  questionnairesAdministeredByMe: QuestionnaireSummary[];
  questionnairesRespondedByMe: QuestionnaireSummary[];
}>();

const formatResponseDueDateTime = (questionnaire: QuestionnaireSummary) => {
  const due = questionnaire.response_due_date_time;
  if (due === undefined) return '期限なし';
  const date = new Date(due);
  return formatRelativeDate(date);
};

const checkIsDueOver = (questionnaire: QuestionnaireSummary) => {
  const due = questionnaire.response_due_date_time;
  if (due === undefined) return false;
  const date = new Date(due);
  return date.getTime() < Date.now();
};
</script>

<template>
  <div class="landing-page-container">
    <div class="title-logo">
      <img src="~/assets/img/logo.svg" alt="anke-to" width="320" />
    </div>

    <div class="questionnaire-list-containers">
      <div class="questionnaire-list-container questionnaires-draft">
        <div class="questionnaire-list-container-title">
          まだ投稿していないアンケート
        </div>
        <QuestionnaireList :questionnaires="questionnairesDraft">
          <template #action="{ questionnaire }">
            <NuxtLink
              class="questionnaire-card-action-link"
              :to="`/questionnaires/${questionnaire.questionnaire_id}/edit`"
            >
              <Icon name="mdi:square-edit-outline" size="24px" />
              <span>アンケートを編集</span>
            </NuxtLink>
          </template>
        </QuestionnaireList>
      </div>

      <div class="questionnaire-list-container questionnaires-targeting-me">
        <div class="questionnaire-list-container-title">
          回答の下書きがあるアンケート
        </div>
        <QuestionnaireList :questionnaires="questionnairesHasDraft">
          <template #tip="{ questionnaire }">
            <div class="questionnaire-card-tip">
              <Icon name="mdi:alarm" size="20px" />
              <span>
                {{ formatResponseDueDateTime(questionnaire) }}
              </span>
            </div>
          </template>
          <template #action="{ questionnaire }">
            <NuxtLink
              v-if="!checkIsDueOver(questionnaire)"
              class="questionnaire-card-action-link"
            >
              <Icon name="mdi:text-box-edit-outline" size="24px" />
              <span>回答を編集 (?)</span>
            </NuxtLink>
          </template>
        </QuestionnaireList>
      </div>

      <div class="questionnaire-list-container questionnaires-targeting-me">
        <div class="questionnaire-list-container-title">
          自分が対象になっているアンケート
        </div>
        <QuestionnaireList :questionnaires="questionnairesTargetingMe">
          <template #tip="{ questionnaire }">
            <div class="questionnaire-card-tip">
              <Icon name="mdi:alarm" size="20px" />
              <span>
                {{ formatResponseDueDateTime(questionnaire) }}
              </span>
            </div>
          </template>
          <template #action="{ questionnaire }">
            <NuxtLink
              v-if="!checkIsDueOver(questionnaire)"
              class="questionnaire-card-action-link"
              :to="`/questionnaires/${questionnaire.questionnaire_id}/responses/new`"
            >
              <Icon name="mdi:form-select" size="24px" />
              <span>アンケートに回答</span>
            </NuxtLink>
          </template>
        </QuestionnaireList>
      </div>

      <div
        class="questionnaire-list-container questionnaires-administrated-by-me"
      >
        <div class="questionnaire-list-container-title">
          自分が管理しているアンケート
        </div>
        <QuestionnaireList :questionnaires="questionnairesAdministeredByMe">
          <template #tip="{ questionnaire }">
            <div class="questionnaire-card-tip">
              <Icon name="mdi:alarm" size="20px" />
              <span>
                {{ formatResponseDueDateTime(questionnaire) }}
              </span>
            </div>
          </template>
          <template #action="{ questionnaire }">
            <NuxtLink
              class="questionnaire-card-action-link"
              :to="`/questionnaires/${questionnaire.questionnaire_id}/edit`"
            >
              <Icon name="mdi:square-edit-outline" size="24px" />
              <span>アンケートを編集</span>
            </NuxtLink>
            <NuxtLink
              class="questionnaire-card-action-link"
              :to="`/questionnaires/${questionnaire.questionnaire_id}/result`"
            >
              <Icon name="mdi:forum-outline" size="24px" />
              <span>結果を確認</span>
            </NuxtLink>
          </template>
        </QuestionnaireList>
      </div>

      <div class="questionnaire-list-container questionnaires-responded-by-me">
        <div class="questionnaire-list-container-title">
          自分が回答したアンケート
        </div>
        <QuestionnaireList :questionnaires="questionnairesRespondedByMe">
          <template #tip="{ questionnaire }">
            <div class="questionnaire-card-tip">
              <Icon name="mdi:alarm" size="20px" />
              <span>
                {{ formatResponseDueDateTime(questionnaire) }}
              </span>
            </div>
          </template>
          <template #action="{ questionnaire }">
            <NuxtLink
              v-if="!checkIsDueOver(questionnaire)"
              class="questionnaire-card-action-link"
            >
              <Icon name="mdi:text-box-edit-outline" size="24px" />
              <span>回答を編集(?)</span>
            </NuxtLink>
          </template>
        </QuestionnaireList>
      </div>

      <div class="questionnaire-list-container all-questionnaires">
        <div class="questionnaire-list-container-title">
          最近投稿されたアンケート
        </div>
        <QuestionnaireList :questionnaires="questionnaires">
          <template #tip="{ questionnaire }">
            <div class="questionnaire-card-tip">
              <Icon name="mdi:alarm" size="20px" />
              <span>
                {{ formatResponseDueDateTime(questionnaire) }}
              </span>
            </div>
          </template>
          <template #action="{ questionnaire }">
            <NuxtLink
              v-if="!checkIsDueOver(questionnaire)"
              class="questionnaire-card-action-link"
              :to="`/questionnaires/${questionnaire.questionnaire_id}/responses/new`"
            >
              <Icon name="mdi:form-select" size="24px" />
              <span>アンケートに回答</span>
            </NuxtLink>
          </template>
        </QuestionnaireList>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.landing-page-container {
  max-width: 1200px;
  margin: 0 auto;
}

.title-logo {
  max-width: 320px;
  margin: 60px auto 0 auto;
}

.questionnaire-list-containers {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 32px;
  margin-top: 64px;
}

@media screen and (max-width: 1200px) {
  .questionnaire-list-containers {
    grid-template-columns: 1fr;
  }
}

.questionnaire-list-container {
}

.questionnaire-list-container-title {
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 16px;
}

.questionnaire-card-action-link {
  font-weight: bold;
  color: $color-primary;
  background-color: mix(white, $color-primary, 92%);
  padding: 8px 16px;
  width: fit-content;
  border-radius: var(--p-border-radius-md);
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 8px;
}

.questionnaire-card-tip {
  display: inline-flex;
  height: 24px;
  align-items: center;
  gap: 2px;
  font-size: 14px;
}
</style>
