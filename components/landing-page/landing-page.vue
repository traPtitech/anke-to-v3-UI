<script lang="ts" setup>
import { type GatewayQuestionnaireSummary } from '~/models/questionnaire';

const props = defineProps<{
  questionnaires: GatewayQuestionnaireSummary[];
  questionnairesDraft: GatewayQuestionnaireSummary[];
  questionnairesHasDraft: GatewayQuestionnaireSummary[];
  questionnairesTargetingMe: GatewayQuestionnaireSummary[];
  questionnairesAdministeredByMe: GatewayQuestionnaireSummary[];
  questionnairesRespondedByMe: GatewayQuestionnaireSummary[];
}>();

const goToCreate = () => navigateTo('/questionnaires/new');
const goToExplorer = () => navigateTo('/explorer');
const goToExplorerTargetingMe = () =>
  navigateTo({ path: '/explorer', query: { onlyTargetingMe: 'true' } });
const goToExplorerDraft = () =>
  navigateTo({ path: '/explorer', query: { isDraft: 'true' } });
const goToAdministrates = () => navigateTo('/administrates');
</script>

<template>
  <div class="landing-page-container">
    <div class="hero-section">
      <div class="title-logo">
        <img src="~/assets/img/logo.svg" alt="anke-to" width="320" />
      </div>
      <div class="quick-links">
        <Button
          label="新規アンケート作成"
          icon="pi pi-plus"
          @click="goToCreate"
        />
        <Button
          label="すべてのアンケート"
          icon="pi pi-list"
          severity="secondary"
          outlined
          @click="goToExplorer"
        />
        <Button
          label="自分が対象のアンケート"
          icon="pi pi-user"
          severity="secondary"
          outlined
          @click="goToExplorerTargetingMe"
        />
        <Button
          label="下書きアンケート"
          icon="pi pi-pencil"
          severity="secondary"
          outlined
          @click="goToExplorerDraft"
        />
        <Button
          label="自分が管理しているアンケート"
          icon="pi pi-cog"
          severity="secondary"
          outlined
          @click="goToAdministrates"
        />
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

.hero-section {
  margin-top: 40px;
  padding: 20px;
  border: 1px solid var(--p-surface-300);
  border-radius: var(--p-border-radius-lg);
  background: linear-gradient(
    180deg,
    var(--p-surface-0) 0%,
    var(--p-surface-50) 100%
  );
}

.title-logo {
  max-width: 320px;
  margin: 0 auto;
}

.hero-copy {
  text-align: center;
  color: var(--p-text-secondary);
  margin: 12px 0 0;
}

.summary-cards {
  margin-top: 20px;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
}

.summary-card {
  padding: 14px;
  border: 1px solid var(--p-surface-300);
  border-radius: var(--p-border-radius-md);
  background-color: var(--p-surface-0);
}

.summary-card-label {
  font-size: 13px;
  color: var(--p-text-secondary);
}

.summary-card-value {
  margin-top: 6px;
  font-size: 26px;
  font-weight: 700;
}

.quick-links {
  margin-top: 16px;
  display: flex;
  justify-content: center;
  gap: 12px;
}

.questionnaire-list-containers {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 32px;
  margin-top: 28px;
}

@media screen and (max-width: 1200px) {
  .questionnaire-list-containers {
    grid-template-columns: 1fr;
  }
}

@media screen and (max-width: 760px) {
  .summary-cards {
    grid-template-columns: repeat(2, 1fr);
  }

  .quick-links {
    flex-direction: column;
    align-items: stretch;
  }
}

.questionnaire-list-container {
}

.questionnaire-list-container-title {
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 16px;
}

.empty-note {
  color: var(--p-text-secondary);
  font-size: 14px;
  margin: 8px 0 0;
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
