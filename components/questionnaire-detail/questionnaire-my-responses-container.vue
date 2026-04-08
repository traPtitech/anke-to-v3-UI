<script lang="ts" setup>
import type { QuestionnaireDetail } from '~/components/questionnaire-detail/type';
import {
  deleteResponse,
  useGetQuestionnaireResponses,
} from '~/composables/type-fetch/anke-to/client';

const props = defineProps<{ detail: QuestionnaireDetail }>();
const { data, refresh } = useGetQuestionnaireResponses(
  props.detail.questionnaire_id,
  {
    onlyMyResponse: true,
  },
);

const deleting = ref<number | null>(null);
const isDueOver = computed(() => {
  const due = props.detail.response_due_date_time;
  if (due === undefined) {
    return false;
  }

  return new Date(due).getTime() < Date.now();
});

const handleDelete = async (responseId: number) => {
  if (!confirm('この回答を削除します。よろしいですか？')) return;
  deleting.value = responseId;
  try {
    await deleteResponse(responseId);
    await refresh();
  } catch {
    alert('削除に失敗しました');
  } finally {
    deleting.value = null;
  }
};
</script>

<template>
  <div class="my-responses-container">
    <h3 class="my-responses-title">
      <Icon name="mdi:file-document-edit-outline" size="18px" />
      <span>あなたの回答</span>
    </h3>
    <small v-if="isDueOver" class="due-over-note">
      回答期限を過ぎているため、回答の編集・削除はできません。
    </small>
    <div v-if="data === undefined" class="status-text">読み込み中...</div>
    <div v-else-if="data.length === 0" class="status-text">
      まだ回答していません
    </div>
    <div v-else class="response-list">
      <div
        v-for="response in data"
        :key="response.response_id"
        class="response-item"
      >
        <NuxtLink
          :to="`/responses/${response.response_id}`"
          class="response-link"
        >
          <div class="response-main">
            <div class="response-header">
              <span v-if="response.is_draft" class="draft-chip">下書き</span>
              <span class="response-date">
                {{ formatRelativeDate(new Date(response.modified_at)) }}
              </span>
            </div>
            <div class="response-sub-date">
              {{ formatDate(new Date(response.modified_at)) }}
            </div>
          </div>
        </NuxtLink>
        <div v-if="!isDueOver" class="response-actions">
          <NuxtLink
            class="action-btn edit-btn"
            :to="`/responses/${response.response_id}/edit`"
            title="編集する"
            aria-label="編集する"
          >
            <Icon name="mdi:pencil-outline" size="16px" />
          </NuxtLink>
          <button
            class="action-btn delete-btn"
            title="削除する"
            aria-label="削除する"
            :disabled="deleting === response.response_id"
            @click="handleDelete(response.response_id)"
          >
            <Icon name="mdi:delete-outline" size="16px" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.my-responses-container {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.my-responses-title {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 15px;
  font-weight: 700;
  color: var(--p-text-color);
  margin: 0;
}

.status-text {
  color: var(--p-text-muted-color);
  font-size: 14px;
}

.due-over-note {
  color: var(--p-text-muted-color);
  font-size: 12px;
}

.response-list {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.response-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 14px;
  border-radius: var(--p-border-radius-md);
  background: var(--p-surface-50);
  transition: background-color 0.15s ease;
}

.response-item:hover {
  background-color: var(--p-surface-100);
}

.response-link {
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  color: inherit;
  text-decoration: none;
}

.response-main {
  min-width: 0;
}

.response-header {
  display: flex;
  align-items: center;
  gap: 8px;
}

.response-date {
  font-weight: 600;
  font-size: 14px;
}

.response-sub-date {
  margin-top: 2px;
  font-size: 12px;
  color: var(--p-text-muted-color);
}

.response-arrow {
  color: var(--p-text-muted-color);
  flex-shrink: 0;
}

.draft-chip {
  display: inline-block;
  padding: 1px 8px;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 700;
  background-color: var(--p-primary-500);
  color: white;
  letter-spacing: 0.02em;
}

.response-actions {
  display: flex;
  align-items: center;
  gap: 4px;
  flex-shrink: 0;
}

.action-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border: none;
  border-radius: var(--p-border-radius-md);
  background: none;
  color: var(--p-text-muted-color);
  text-decoration: none;
  cursor: pointer;
  transition: all 0.15s ease;
}

.action-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.edit-btn:hover:not(:disabled) {
  background-color: var(--p-surface-200);
  color: var(--p-primary-600);
}

.delete-btn:hover:not(:disabled) {
  background-color: var(--p-surface-200);
  color: var(--p-orange-600);
}
</style>
