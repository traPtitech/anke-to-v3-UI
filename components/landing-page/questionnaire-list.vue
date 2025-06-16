<script lang="ts" setup>
import type { QuestionnaireSummary } from './type';

defineProps<{
  questionnaires: QuestionnaireSummary[];
}>();
</script>

<template>
  <div>
    <div
      v-for="questionnaire in questionnaires"
      :key="questionnaire.questionnaire_id"
      class="questionnaire-card"
    >
      <div class="questionnaire-card-title-container">
        <a
          class="questionnaire-card-title"
          :href="`/questionnaires/${questionnaire.questionnaire_id}`"
        >
          {{ questionnaire.title }}
        </a>
        <div class="questionnaire-card-tip-section">
          <slot name="tip" v-bind="{ questionnaire }" />
        </div>
      </div>

      <div class="questionnaire-card-description">
        {{ questionnaire.description }}
      </div>

      <div class="questionnaire-card-action-section">
        <slot name="action" v-bind="{ questionnaire }" />
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
  color: $color-primary;
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
