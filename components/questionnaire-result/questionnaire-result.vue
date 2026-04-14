<script lang="ts" setup>
import ButtonLink from '~/components/ui/button-link.vue';
import QuestionnaireRespondentsContainer from '~/components/ui/questionnaire/respondents-container.vue';
import ResultTitleContainer from '~/components/ui/questionnaire/result-title-container.vue';
import type { GatewayQuestionnaire } from '~/models/questionnaire';
import type { GatewayResponse } from '~/models/response';
import { useQuestionnaireResult } from './composables/use-questionnaire-result';
import QuestionnaireResultExportDialog from './questionnaire-result-export-dialog.vue';
import QuestionResult from './question-result.vue';

const props = defineProps<{
  questionnaire: GatewayQuestionnaire;
  responses: GatewayResponse[];
}>();

const { results } = useQuestionnaireResult(
  props.questionnaire,
  props.responses,
);
</script>

<template>
  <div class="questionnaire-result-container">
    <div class="result-header">
      <ButtonLink
        variant="secondary"
        :to="`/questionnaires/${props.questionnaire.questionnaire_id}`"
      >
        <Icon name="mdi:chevron-left" size="24px" />
        <span>アンケート詳細画面に戻る</span>
      </ButtonLink>

      <QuestionnaireResultExportDialog
        :questionnaire="props.questionnaire"
        :responses="props.responses"
      />
    </div>

    <section class="result-info-section">
      <div class="result-info-header">
        <p class="section-label">アンケート情報</p>
      </div>
      <ResultTitleContainer :questionnaire="props.questionnaire" />
      <QuestionnaireRespondentsContainer :questionnaire="props.questionnaire" />
    </section>

    <section class="result-questions-section">
      <div class="result-questions-header">
        <h2>質問ごとの結果</h2>
      </div>

      <QuestionResult
        v-for="(result, i) in results"
        :key="i"
        :result="result"
        :index="i + 1"
        :total="results.length"
        :is-anonymous="props.questionnaire.is_anonymous"
      />
    </section>
  </div>
</template>

<style lang="scss" scoped>
.questionnaire-result-container {
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 100%;
  max-width: 1080px;
  margin: 0 auto;
  padding-bottom: 50vh;
}

.result-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
}

.result-info-section,
.result-questions-section {
  display: flex;
  flex-direction: column;
  gap: 16px;
  border: 1px solid var(--p-surface-200);
  border-radius: 12px;
  padding: 20px;
  background-color: var(--p-surface-0);
}

.result-questions-section {
  gap: 14px;
}

.section-label {
  margin: 0;
  font-size: 12px;
  font-weight: 700;
  color: var(--p-text-secondary);
  letter-spacing: 0.04em;
}

.result-info-header {
  display: flex;
  align-items: center;
  gap: 8px;
}

.export-dialog-content {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.export-option-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(200px, 1fr));
  gap: 10px;
}

.export-option-label {
  display: flex;
  flex-direction: column;
  gap: 6px;
  font-size: 13px;
  font-weight: 600;
  color: var(--p-text-secondary);
}

.export-select {
  width: 100%;
}

.export-preview {
  width: 100%;
  min-height: min(48vh, 420px);
  resize: vertical;
  border: 1px solid var(--p-surface-300);
  border-radius: var(--p-border-radius-sm);
  background-color: var(--p-surface-50);
  color: var(--p-text-color);
  padding: 10px 12px;
  font-size: 13px;
  line-height: 1.45;
  font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
}

.export-dialog-actions {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}

@media screen and (max-width: 640px) {
  .export-option-grid {
    grid-template-columns: 1fr;
  }

  .export-dialog-actions {
    justify-content: stretch;
  }

  .export-dialog-actions :deep(.p-button) {
    flex: 1;
  }
}

.result-questions-header {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: 8px;
  padding-bottom: 8px;
  border-bottom: 1px solid var(--p-surface-200);
}

.result-questions-header h2 {
  margin: 0;
  font-size: 19px;
}
</style>
