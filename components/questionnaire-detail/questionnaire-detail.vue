<script lang="ts" setup>
import type { QuestionnaireDetail } from './type';

defineProps<{ detail: QuestionnaireDetail }>();
</script>

<template>
  <div class="questionnaire-detail-container">
    <QuestionnaireTitleContainer :questionnaire="detail" />
    <QuestionnaireBasicInfoContainer :questionnaire="detail" />
    <QuestionnaireActions :detail="detail" />
    <QuestionnaireRespondentsContainer :questionnaire="detail" />
    <QuestionnaireMiscInfoContainer :questionnaire="detail" />
    <QuestionnaireAdminActions :detail="detail" />
  </div>
</template>

<style lang="scss">
.questionnaire-detail-container {
  max-width: 1080px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 16px;
  container-type: inline-size;
  padding-bottom: 50vh;
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
  .questionnaire-detail-element-container {
    padding: 16px;
  }
}
</style>
