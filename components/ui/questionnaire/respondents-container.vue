<script setup lang="ts">
import UserAndGroupList from '~/components/questionnaire-detail/user-and-group-list.vue';
import UserList from '~/components/questionnaire-detail/user-list.vue';
import type { GatewayQuestionnaire } from '~/models/questionnaire';
import QuestionnaireLabel from './label.vue';
import NoContentMessage from '~/components/ui/no-content-message.vue';

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

const toast = useToast();

const handleCopyMentions = async () => {
  const mentions = nonAnsweredTargets.value.map((u) => `@${u}`).join(' ');
  try {
    await navigator.clipboard.writeText(mentions);
    toast.add({
      severity: 'success',
      summary: '未回答者一覧をコピーしました',
      life: 3000,
    });
  } catch {
    toast.add({
      severity: 'error',
      summary: 'コピーに失敗しました',
      life: 4000,
    });
  }
};

const handleCopyRespondents = async () => {
  const mentions = props.questionnaire.respondents
    .map((u) => `@${u}`)
    .join(' ');
  try {
    await navigator.clipboard.writeText(mentions);
    toast.add({
      severity: 'success',
      summary: '回答者一覧をコピーしました',
      life: 3000,
    });
  } catch {
    toast.add({
      severity: 'error',
      summary: 'コピーに失敗しました',
      life: 4000,
    });
  }
};
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
          user-dialog-title="対象ユーザー一覧"
          group-dialog-title="対象グループ一覧"
        />
      </div>
      <div class="sidebar-people-item">
        <div v-if="props.questionnaire.respondents.length === 0">
          <NoContentMessage>いません</NoContentMessage>
        </div>
        <div class="sidebar-people-header">
          <QuestionnaireLabel>回答済み</QuestionnaireLabel>
          <Button
            v-if="props.questionnaire.respondents.length > 0"
            class="copy-mentions-trigger"
            severity="secondary"
            outlined
            @click="handleCopyRespondents"
          >
            <Icon name="mdi:content-copy" size="14px" />
          </Button>
        </div>
        <UserList
          :users="props.questionnaire.respondents"
          dialog-title="回答済みユーザー一覧"
        />
      </div>
      <div class="sidebar-people-item">
        <div class="sidebar-people-header">
          <QuestionnaireLabel>未回答</QuestionnaireLabel>
          <div v-if="nonAnsweredTargets.length === 0">
            <NoContentMessage>いません</NoContentMessage>
          </div>
          <Button
            v-if="nonAnsweredTargets.length > 0"
            class="copy-mentions-trigger"
            severity="secondary"
            outlined
            @click="handleCopyMentions"
          >
            <Icon name="mdi:content-copy" size="14px" />
          </Button>
        </div>
        <UserList
          :users="nonAnsweredTargets"
          dialog-title="未回答ユーザー一覧"
        />
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

.sidebar-people-header {
  display: flex;
  align-items: center;
  gap: 8px;
}

.copy-mentions-trigger {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 6px;
}
</style>
