<script lang="ts" setup>
import { actionNotRespond, actionRespondLater } from './action';
import type { QuestionnaireDetail } from './type';

const props = defineProps<{ detail: QuestionnaireDetail }>();

const { getGroupMembersFromGroupID, getGroupNameFromUserID } =
  await useTraqGroup();
const { getTraqIDFromUserID } = await useTraqId();

const { users: adminUsers } = useResolveUserSpecifier(props.detail.admins, {
  getGroupMembersFromGroupID,
  getGroupNameFromUserID,
  getTraqIDFromUserID,
});

const me = useMe();

const canRespond = computed(() => {
  // 既に回答済み
  if (
    !props.detail.is_allowing_multiple_responses &&
    me.value &&
    props.detail.respondents.includes(me.value.name)
  )
    return false;

  // 期限なし
  if (props.detail.response_due_date_time === undefined) return true;

  const now = new Date();
  const due = new Date(props.detail.response_due_date_time);
  return now < due;
});

const canViewResult = computed(() => {
  if (props.detail.response_viewable_by === 'anyone') return true;
  if (props.detail.response_viewable_by === 'respondents') {
    if (!me.value) return false;
    return props.detail.respondents.includes(me.value.name);
  }
  if (props.detail.response_viewable_by === 'admins') {
    if (!me.value) return false;
    return adminUsers.value.includes(me.value.name);
  }

  const _: never = props.detail.response_viewable_by;
  throw new Error(`Unknown response_viewable_by: ${_}`);
});
</script>

<template>
  <div class="questionnaire-actions-container">
    <router-link
      :to="
        canRespond
          ? `/questionnaires/${detail.questionnaire_id}/responses/new`
          : ''
      "
      class="questionnaire-action-button-link"
      :aria-disabled="!canRespond"
    >
      <Button class="questionnaire-action-button" :disabled="!canRespond">
        <Icon name="mdi:send" size="24px" />
        <span>回答する</span>
      </Button>
    </router-link>
    <Button
      class="questionnaire-action-button"
      outlined
      :disabled="!canRespond"
      @click="actionRespondLater(detail.questionnaire_id)"
    >
      <Icon name="mdi:send-clock" size="24px" />
      <span>後で回答する</span>
    </Button>
    <Button
      class="questionnaire-action-button"
      outlined
      :disabled="!canRespond"
      @click="actionNotRespond(detail.questionnaire_id)"
    >
      <Icon name="mdi:flag" size="24px" />
      <span>回答しない</span>
    </Button>
    <router-link
      :to="
        canViewResult ? `/questionnaires/${detail.questionnaire_id}/result` : ''
      "
      class="questionnaire-action-button-link"
      :aria-disabled="!canRespond"
    >
      <Button
        class="questionnaire-action-button"
        outlined
        :disabled="!canViewResult"
      >
        <Icon name="mdi:text-box-multiple-outline" size="24px" />
        <span>結果を見る</span>
      </Button>
    </router-link>
  </div>
</template>

<style lang="scss" scoped>
.questionnaire-actions-container {
  display: grid;
  gap: 16px;
  padding: 16px 0;
  grid-template-columns: 1fr 1fr 1fr 1fr;
}

@container (max-width: 740px) {
  .questionnaire-actions-container {
    grid-template-columns: 1fr 1fr;
  }
}

@container (max-width: 360px) {
  .questionnaire-actions-container {
    grid-template-columns: 1fr;
  }
}

.questionnaire-action-button-link {
  text-decoration: none;
}

.questionnaire-action-button {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
}
</style>
