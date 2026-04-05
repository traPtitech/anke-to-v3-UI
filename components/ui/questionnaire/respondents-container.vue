<script setup lang="ts">
import UserAndGroupList from '~/components/questionnaire-detail/user-and-group-list.vue';
import UserList from '~/components/questionnaire-detail/user-list.vue';
import type { GatewayQuestionnaire } from '~/models/questionnaire';
import QuestionnaireLabel from './label.vue';

const props = defineProps<{
  questionnaire: GatewayQuestionnaire;
}>();

const { allUserNames } = useAllUsers();

const targets = computed(() => {
  if (props.questionnaire.targets.includes(ALL_MENTION_USER)) {
    return allUserNames.value;
  } else {
    return props.questionnaire.targets;
  }
});

const nonAnsweredTargets = computed(() =>
  targets.value.filter(
    (user) =>
      !props.questionnaire.respondents.includes(user) &&
      user !== ALL_MENTION_USER,
  ),
);
</script>

<template>
  <div class="sidebar-section">
    <h3 class="sidebar-section-title">
      <Icon name="mdi:account-multiple-outline" size="16px" />
      <span>ユーザー</span>
    </h3>
    <div class="sidebar-people-list">
      <div class="sidebar-people-item">
        <QuestionnaireLabel>対象者</QuestionnaireLabel>
        <UserAndGroupList
          :specifier="props.questionnaire.target"
          :actual-users="props.questionnaire.targets"
        />
      </div>
      <div class="sidebar-people-item">
        <QuestionnaireLabel>回答済み</QuestionnaireLabel>
        <UserList :users="props.questionnaire.respondents" />
      </div>
      <div class="sidebar-people-item">
        <QuestionnaireLabel>未回答</QuestionnaireLabel>
        <UserList :users="nonAnsweredTargets" />
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

.sidebar-people-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.sidebar-people-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}
</style>
