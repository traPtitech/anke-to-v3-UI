<script lang="ts" setup>
import type { QuestionnaireDetail } from '~/components/questionnaire-detail/type';
import QuestionnaireContainer from '~/components/ui/questionnaire/container.vue';
import QuestionnaireLabel from '~/components/ui/questionnaire/label.vue';
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
const handleDelete = async (responseId: number) => {
  if (!confirm('この回答を削除します。よろしいですか？')) return;
  deleting.value = responseId;
  try {
    await deleteResponse(responseId);
    await refresh();
  } catch (e) {
    alert('削除に失敗しました');
  } finally {
    deleting.value = null;
  }
};
</script>

<template>
  <QuestionnaireContainer>
    <QuestionnaireLabel>あなたの回答</QuestionnaireLabel>
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
            <div class="response-date">
              {{ formatRelativeDate(new Date(response.modified_at)) }}
            </div>
            <div class="response-sub-date">
              {{ formatDate(new Date(response.modified_at)) }}
            </div>
          </div>
          <div class="response-meta">
            <span v-if="response.is_draft" class="draft-chip">下書き</span>
            <Icon name="mdi:chevron-right" size="18px" />
          </div>
        </NuxtLink>
        <Button
          size="small"
          variant="outlined"
          severity="secondary"
          class="delete-button"
          :disabled="deleting === response.response_id"
          @click="handleDelete(response.response_id)"
        >
          <Icon name="mdi:delete-outline" size="18px" />
        </Button>
      </div>
    </div>
  </QuestionnaireContainer>
</template>

<style lang="scss" scoped>
.status-text {
  color: var(--p-text-muted-color);
}

.response-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.response-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px;
  border: 1px solid var(--p-surface-300);
  border-radius: var(--p-border-radius-md);
  background: none;
}

.delete-button {
  width: 2rem;
  height: 2rem;
  flex-shrink: 0;
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

.response-item:hover {
  background-color: var(--p-surface-100);
}

.response-main {
  min-width: 0;
}

.response-date {
  font-weight: 600;
}

.response-sub-date {
  margin-top: 2px;
  font-size: 12px;
  color: var(--p-text-muted-color);
}

.response-meta {
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--p-text-muted-color);
}

.draft-chip {
  display: inline-block;
  padding: 2px 8px;
  border-radius: var(--p-border-radius-md);
  font-size: 12px;
  font-weight: bold;
  background-color: hsl(0, 62%, 50%);
  color: white;
}
</style>
