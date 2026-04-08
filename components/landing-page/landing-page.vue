<script lang="ts" setup>
import ButtonLink from '~/components/ui/button-link.vue';
import type { GatewayQuestionnaireSummary } from '~/models/questionnaire';

const _props = defineProps<{
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
    <div class="hero-section">
      <div class="title-logo">
        <img src="~/assets/img/logo.svg" alt="anke-to" width="320" />
      </div>
      <div class="quick-links">
        <ButtonLink
          class="quick-link-button"
          to="/questionnaires/new"
          variant="primary"
        >
          <Icon name="mdi:plus" size="18px" />
          <span>新規アンケート作成</span>
        </ButtonLink>
        <ButtonLink
          class="quick-link-button"
          to="/explorer"
          variant="secondary"
        >
          <Icon name="mdi:view-list" size="18px" />
          <span>すべてのアンケート</span>
        </ButtonLink>
        <ButtonLink
          class="quick-link-button"
          :to="{ path: '/explorer', query: { filter: 'targeting' } }"
          variant="secondary"
        >
          <Icon name="mdi:account" size="18px" />
          <span>自分が対象のアンケート</span>
        </ButtonLink>
        <ButtonLink
          class="quick-link-button"
          :to="{ path: '/explorer', query: { filter: 'draft' } }"
          variant="secondary"
        >
          <Icon name="mdi:pencil" size="18px" />
          <span>下書きアンケート</span>
        </ButtonLink>
        <ButtonLink
          class="quick-link-button"
          to="/administrates"
          variant="secondary"
        >
          <Icon name="mdi:cog-outline" size="18px" />
          <span>自分が管理しているアンケート</span>
        </ButtonLink>
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
  background-color: var(--p-surface-0);
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

.quick-link-button {
  white-space: nowrap;
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
