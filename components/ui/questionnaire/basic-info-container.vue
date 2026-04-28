<script setup lang="ts">
import { type GatewayQuestionnaire, responseViewableByOptionsMap } from '~/models/questionnaire';
import QuestionnaireLabel from './label.vue';

const props = defineProps<{
  questionnaire: GatewayQuestionnaire;
}>();

const dueDateString = computed(() => {
  if (props.questionnaire.response_due_date_time === undefined) {
    return '期限なし';
  }

  const relativeDue = formatRelativeDate(new Date(props.questionnaire.response_due_date_time));
  const absoluteDue = formatDate(new Date(props.questionnaire.response_due_date_time));
  return `${relativeDue} (${absoluteDue})`;
});

const responseViewableByString = computed(() => {
  return responseViewableByOptionsMap[props.questionnaire.response_viewable_by];
});
</script>

<template>
  <div class="sidebar-section">
    <h3 class="sidebar-section-title">
      <Icon name="mdi:cog-outline" size="16px" />
      <span>設定</span>
    </h3>
    <div class="sidebar-info-list">
      <div class="sidebar-info-item">
        <QuestionnaireLabel>回答期限</QuestionnaireLabel>
        <div class="sidebar-info-value">{{ dueDateString }}</div>
      </div>
      <div class="sidebar-attributes">
        <span class="attribute-chip">
          <Icon name="mdi:eye-outline" size="14px" />
          {{ responseViewableByString }}公開
        </span>
        <span class="attribute-chip">
          <Icon :name="questionnaire.is_anonymous ? 'mdi:incognito' : 'mdi:account'" size="14px" />
          {{ questionnaire.is_anonymous ? '匿名' : '記名' }}
        </span>
        <span class="attribute-chip">
          <Icon
            :name="
              questionnaire.is_duplicate_answer_allowed
                ? 'mdi:checkbox-multiple-marked-outline'
                : 'mdi:checkbox-marked-outline'
            "
            size="14px"
          />
          {{ questionnaire.is_duplicate_answer_allowed ? '複数回答' : '単一回答' }}
        </span>
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

.sidebar-attributes {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 4px;
}

.attribute-chip {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 10px;
  border-radius: var(--p-border-radius-sm);
  background-color: var(--p-surface-100);
  color: var(--p-text-color);
  font-size: 13px;
  font-weight: 500;
}
</style>
