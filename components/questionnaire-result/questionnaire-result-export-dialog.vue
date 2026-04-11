<script lang="ts" setup>
import type { GatewayQuestionnaire } from '~/models/questionnaire';
import type { GatewayResponse } from '~/models/response';
import {
  type ExportFormat,
  type ExportTarget,
  useQuestionnaireResponseExport,
} from './composables/use-questionnaire-response-export';

const props = defineProps<{
  questionnaire: GatewayQuestionnaire;
  responses: GatewayResponse[];
}>();

const toast = useToast();

const { createPreviewText, downloadExportText } =
  useQuestionnaireResponseExport({
    questionnaire: computed(() => props.questionnaire),
    responses: computed(() => props.responses),
  });

const isExportDialogVisible = ref(false);
const exportTarget = ref<ExportTarget>('summary');
const exportFormat = ref<ExportFormat>('md');

const exportTargetOptions: { value: ExportTarget; label: string }[] = [
  { value: 'summary', label: '集計結果' },
  { value: 'responses', label: '個別の回答' },
];

const exportFormatOptions: { value: ExportFormat; label: string }[] = [
  { value: 'md', label: 'Markdown (.md)' },
  { value: 'csv', label: 'CSV (.csv)' },
  { value: 'json', label: 'JSON (.json)' },
];

const exportPreviewText = computed(() =>
  createPreviewText({
    target: exportTarget.value,
    format: exportFormat.value,
  }),
);

const handleCopyExportText = async () => {
  try {
    await navigator.clipboard.writeText(exportPreviewText.value);
    toast.add({
      severity: 'success',
      summary: 'コピーしました',
      detail: '出力テキストをクリップボードへコピーしました。',
      life: 3000,
    });
  } catch {
    toast.add({
      severity: 'error',
      summary: 'コピーに失敗しました',
      detail: 'ブラウザの権限設定を確認してください。',
      life: 4000,
    });
  }
};

const handleDownloadExportText = () => {
  downloadExportText({
    target: exportTarget.value,
    format: exportFormat.value,
  });
};
</script>

<template>
  <div class="questionnaire-result-export-dialog">
    <Button
      class="result-export-trigger"
      severity="secondary"
      outlined
      @click="isExportDialogVisible = true"
    >
      <Icon name="mdi:file-export-outline" size="18px" />
      <span>出力</span>
    </Button>

    <Dialog
      v-model:visible="isExportDialogVisible"
      modal
      header="出力"
      :style="{ width: 'min(840px, 96vw)' }"
    >
      <div class="export-dialog-content">
        <div class="export-option-grid">
          <label class="export-option-label">
            <span>出力対象</span>
            <Select
              v-model="exportTarget"
              :options="exportTargetOptions"
              option-label="label"
              option-value="value"
              class="export-select"
            />
          </label>

          <label class="export-option-label">
            <span>出力形式</span>
            <Select
              v-model="exportFormat"
              :options="exportFormatOptions"
              option-label="label"
              option-value="value"
              class="export-select"
            />
          </label>
        </div>

        <label class="export-option-label">
          <span>出力プレビュー（readonly）</span>
          <textarea
            :value="exportPreviewText"
            class="export-preview"
            readonly
          />
        </label>

        <div class="export-dialog-actions">
          <Button severity="secondary" outlined @click="handleCopyExportText">
            <Icon name="mdi:content-copy" size="16px" />
            <span>コピー</span>
          </Button>
          <Button severity="secondary" @click="handleDownloadExportText">
            <Icon name="mdi:download" size="16px" />
            <span>ダウンロード</span>
          </Button>
        </div>
      </div>
    </Dialog>
  </div>
</template>

<style lang="scss" scoped>
.questionnaire-result-export-dialog {
  display: inline-flex;
}

.result-export-trigger {
  display: inline-flex;
  align-items: center;
  gap: 6px;
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
</style>
