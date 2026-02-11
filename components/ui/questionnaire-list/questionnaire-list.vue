<script lang="ts" setup>
import ButtonLink from '~/components/ui/button-link.vue';
import MarkdownBlock from '~/components/ui/markdown/markdown-block.vue';
import type { GatewayQuestionnaireSummary } from '~/models/questionnaire';
import {
  canRespond,
  canViewResults,
  checkIsDueOver,
  formatResponseDueDateTime,
} from '~/models/questionnaire';

const props = defineProps<{
  questionnaires: GatewayQuestionnaireSummary[];
}>();
</script>

<template>
  <div>
    <div
      v-for="questionnaire in props.questionnaires"
      :key="questionnaire.questionnaire_id"
      class="questionnaire-card"
    >
      <div class="questionnaire-card-title-container">
        <NuxtLink
          class="questionnaire-card-title"
          :to="`/questionnaires/${questionnaire.questionnaire_id}`"
        >
          {{ questionnaire.title }}
        </NuxtLink>
        <div class="questionnaire-card-tip-section">
          <div v-if="questionnaire.is_published" class="questionnaire-card-tip">
            <Icon name="mdi:alarm" size="20px" />
            <span>
              {{ formatResponseDueDateTime(questionnaire) }}
            </span>
          </div>
        </div>
      </div>

      <MarkdownBlock
        class="questionnaire-card-description"
        :content="questionnaire.description"
      />

      <div class="questionnaire-card-action-section">
        <ButtonLink
          :to="`/questionnaires/${questionnaire.questionnaire_id}/edit`"
          title="アンケートを編集"
        >
          <Icon name="mdi:square-edit-outline" size="24px" />
        </ButtonLink>
        <ButtonLink
          :disabled="!canViewResults(questionnaire)"
          :to="`/questionnaires/${questionnaire.questionnaire_id}/result`"
          title="結果を確認"
        >
          <Icon name="mdi:forum-outline" size="24px" />
        </ButtonLink>
        <ButtonLink
          :disabled="
            !questionnaire.has_my_response || checkIsDueOver(questionnaire)
          "
          title="回答を編集"
        >
          <Icon name="mdi:text-box-edit-outline" size="24px" />
        </ButtonLink>
        <ButtonLink
          :disabled="!canRespond(questionnaire)"
          :to="`/questionnaires/${questionnaire.questionnaire_id}/responses/new`"
          title="回答する"
        >
          <Icon name="mdi:send" size="24px" />
        </ButtonLink>
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
  color: variables.$color-primary;
  margin-bottom: 8px;
  text-decoration: none;

  overflow: hidden;
  display: -webkit-box;
  text-overflow: ellipsis;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  line-clamp: 2;
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
  line-clamp: 3;
  max-height: 72px;
}

.questionnaire-card-action-section {
  display: flex;
  justify-content: flex-end;
  margin-top: 16px;
  gap: 16px;
}
</style>
