<script setup lang="ts">
import UserAndGroupList from '~/components/questionnaire-detail/user-and-group-list.vue';
import type { GatewayQuestionnaire } from '~/models/questionnaire';
import QuestionnaireLabel from './label.vue';

const props = defineProps<{
  questionnaire: GatewayQuestionnaire;
}>();
</script>

<template>
  <div class="sidebar-section">
    <h3 class="sidebar-section-title">
      <Icon name="mdi:information-outline" size="16px" />
      <span>情報</span>
    </h3>
    <div class="sidebar-info-list">
      <div class="sidebar-info-item">
        <QuestionnaireLabel>管理者</QuestionnaireLabel>
        <UserAndGroupList
          :specifier="props.questionnaire.admin"
          :actual-users="props.questionnaire.admins"
        />
      </div>
      <div class="sidebar-info-item">
        <QuestionnaireLabel>最終更新</QuestionnaireLabel>
        <div class="sidebar-info-value">
          {{ formatRelativeDate(new Date(props.questionnaire.modified_at)) }}
          <span class="sidebar-info-sub">
            ({{ formatDate(new Date(props.questionnaire.modified_at)) }})
          </span>
        </div>
      </div>
      <div class="sidebar-info-item">
        <QuestionnaireLabel>作成日時</QuestionnaireLabel>
        <div class="sidebar-info-value">
          {{ formatRelativeDate(new Date(props.questionnaire.created_at)) }}
          <span class="sidebar-info-sub">
            ({{ formatDate(new Date(props.questionnaire.created_at)) }})
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.sidebar-section {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.sidebar-section-title {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  font-weight: 700;
  color: var(--p-text-color);
  margin: 0;
  padding-bottom: 8px;
  border-bottom: 1px solid var(--p-surface-200);
}

.sidebar-info-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.sidebar-info-item {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.sidebar-info-value {
  font-size: 14px;
  color: var(--p-text-color);
}

.sidebar-info-sub {
  font-size: 12px;
  color: var(--p-text-muted-color);
}
</style>
