<script lang="ts" setup>
import type { QuestionnaireDetail } from '~/components/questionnaire-detail/type';
import QuestionnaireContainer from '~/components/ui/questionnaire/container.vue';
import QuestionnaireLabel from '~/components/ui/questionnaire/label.vue';
import { useGetQuestionnaireResponses } from '~/composables/type-fetch/anke-to/client';

const props = defineProps<{ detail: QuestionnaireDetail }>();
const { data } = useGetQuestionnaireResponses(props.detail.questionnaire_id, {
  onlyMyResponse: true,
});
</script>

<template>
  <QuestionnaireContainer>
    <QuestionnaireLabel>あなたの回答</QuestionnaireLabel>
    <div v-if="data === undefined" class="status-text">読み込み中...</div>
    <div v-else-if="data.length === 0" class="status-text">
      まだ回答していません
    </div>
    <div v-else class="response-list">
      <NuxtLink
        v-for="response in data"
        :key="response.response_id"
        :to="`/responses/${response.response_id}`"
        class="response-item"
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
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  padding: 12px;
  border: 1px solid var(--p-surface-300);
  border-radius: var(--p-border-radius-md);
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
