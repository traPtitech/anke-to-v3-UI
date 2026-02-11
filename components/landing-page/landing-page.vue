<script lang="ts" setup>
import QuestionnaireList from '~/components/ui/questionnaire-list/questionnaire-list.vue';
import { type GatewayQuestionnaireSummary } from '~/models/questionnaire';

defineProps<{
  questionnaires: GatewayQuestionnaireSummary[];
  questionnairesDraft: GatewayQuestionnaireSummary[];
  questionnairesHasDraft: GatewayQuestionnaireSummary[];
  questionnairesTargetingMe: GatewayQuestionnaireSummary[];
  questionnairesAdministeredByMe: GatewayQuestionnaireSummary[];
  questionnairesRespondedByMe: GatewayQuestionnaireSummary[];
}>();
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
        <QuestionnaireList :questionnaires="questionnairesDraft" />
      </div>

      <div class="questionnaire-list-container questionnaires-targeting-me">
        <div class="questionnaire-list-container-title">
          回答の下書きがあるアンケート
        </div>
        <QuestionnaireList :questionnaires="questionnairesHasDraft" />
      </div>

      <div class="questionnaire-list-container questionnaires-targeting-me">
        <div class="questionnaire-list-container-title">
          自分が対象になっているアンケート
        </div>
        <QuestionnaireList :questionnaires="questionnairesTargetingMe" />
      </div>

      <div
        class="questionnaire-list-container questionnaires-administrated-by-me"
      >
        <div class="questionnaire-list-container-title">
          自分が管理しているアンケート
        </div>
        <QuestionnaireList :questionnaires="questionnairesAdministeredByMe" />
      </div>

      <div class="questionnaire-list-container questionnaires-responded-by-me">
        <div class="questionnaire-list-container-title">
          自分が回答したアンケート
        </div>
        <QuestionnaireList :questionnaires="questionnairesRespondedByMe" />
      </div>

      <div class="questionnaire-list-container all-questionnaires">
        <div class="questionnaire-list-container-title">
          最近投稿されたアンケート
        </div>
        <QuestionnaireList :questionnaires="questionnaires" />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use 'sass:color';

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
  color: variables.$color-primary;
  background-color: color.mix(white, variables.$color-primary, 92%);
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
