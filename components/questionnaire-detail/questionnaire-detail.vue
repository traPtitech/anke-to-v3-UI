<script lang="ts" setup>
import QuestionnaireBasicInfoContainer from '~/components/ui/questionnaire/basic-info-container.vue';
import QuestionnaireMiscInfoContainer from '~/components/ui/questionnaire/misc-info-container.vue';
import QuestionnaireRespondentsContainer from '~/components/ui/questionnaire/respondents-container.vue';
import QuestionnaireTitleContainer from '~/components/ui/questionnaire/title-container.vue';
import QuestionnaireActions from './questionnaire-actions.vue';
import QuestionnaireAdminActions from './questionnaire-admin-actions.vue';
import QuestionnaireMyResponsesContainer from './questionnaire-my-responses-container.vue';
import type { QuestionnaireDetail } from './type';

defineProps<{ detail: QuestionnaireDetail }>();
</script>

<template>
  <div class="questionnaire-detail-container">
    <QuestionnaireTitleContainer
      :questionnaire="detail"
      class="detail-card detail-card-title"
    />

    <section class="detail-surface-group">
      <QuestionnaireActions
        :detail="detail"
        class="detail-card detail-card-soft"
      />
      <QuestionnaireBasicInfoContainer
        :questionnaire="detail"
        class="detail-card detail-card-soft"
      />
      <QuestionnaireRespondentsContainer
        :questionnaire="detail"
        class="detail-card detail-card-soft"
      />
      <QuestionnaireMiscInfoContainer
        :questionnaire="detail"
        class="detail-card detail-card-soft"
      />
      <QuestionnaireMyResponsesContainer
        :detail="detail"
        class="detail-card detail-card-soft"
      />
    </section>

    <section class="detail-danger-group">
      <QuestionnaireAdminActions
        :detail="detail"
        class="detail-card detail-card-danger"
      />
    </section>
  </div>
</template>

<style lang="scss">
.questionnaire-detail-container {
  max-width: 1080px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 20px;
  container-type: inline-size;
  padding-bottom: 50vh;
}

.detail-surface-group {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 14px;
  border-radius: calc(var(--p-border-radius-md) + 8px);
  background: linear-gradient(
    180deg,
    color-mix(in srgb, var(--p-surface-0) 70%, var(--p-surface-100)),
    color-mix(in srgb, var(--p-surface-0) 45%, var(--p-surface-100))
  );
}

.detail-danger-group {
  padding: 14px;
  border-radius: calc(var(--p-border-radius-md) + 8px);
  background: color-mix(in srgb, var(--p-red-100) 38%, var(--p-surface-0));
}

.questionnaire-detail-container :deep(.detail-card.questionnaire-container),
.questionnaire-detail-container
  :deep(.detail-card.questionnaire-grid-container) {
  border: none;
  box-shadow: none;
  border-radius: var(--p-border-radius-md);
}

.questionnaire-detail-container
  :deep(.detail-card-soft.questionnaire-container),
.questionnaire-detail-container
  :deep(.detail-card-soft.questionnaire-grid-container) {
  background: color-mix(in srgb, var(--p-surface-0) 82%, var(--p-surface-100));
}

.questionnaire-detail-container
  :deep(.detail-card-title.questionnaire-container) {
  background: linear-gradient(
    135deg,
    color-mix(in srgb, var(--p-red-100) 58%, var(--p-surface-0)),
    color-mix(in srgb, var(--p-red-50) 40%, var(--p-surface-0))
  );
}

.questionnaire-detail-container :deep(.detail-card-danger) {
  background: transparent;
}

.questionnaire-detail-element-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  padding: 32px;
  border: 1px solid var(--p-surface-300);
  border-radius: var(--p-border-radius-md);
}

.questionnaire-detail-element {
}

.questionnaire-detail-element-label {
  font-weight: bold;
  font-size: 14px;
}

@media screen and (max-width: variables.$breakpoint-lg) {
  .questionnaire-target-container {
    grid-template-columns: 1fr;
  }
}

@media screen and (max-width: variables.$breakpoint-md) {
  .questionnaire-detail-element-container {
    grid-template-columns: 1fr;
  }
}

@media screen and (max-width: variables.$breakpoint-sm) {
  .detail-surface-group,
  .detail-danger-group {
    padding: 8px;
  }

  .questionnaire-detail-element-container {
    padding: 16px;
  }
}
</style>
