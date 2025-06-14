<script lang="ts" setup>
import { actionNotRespond, actionRespondLater } from './action';
import type { QuestionnaireDetail, ResShareType } from './type';

const props = defineProps<{ detail: QuestionnaireDetail }>();

const me = await useMe();

const canRespond = computed(() => {
  // 既に回答済み
  if (
    !props.detail.is_duplicate_answer_allowed &&
    props.detail.respondents.includes(me.value?.name ?? '')
  )
    return false;

  // 期限なし
  if (props.detail.response_due_date_time === undefined) return true;

  const now = new Date();
  const due = new Date(props.detail.response_due_date_time);
  return now < due;
});

const canViewResult = computed(() => {
  const isRespondent = props.detail.respondents.includes(me.value?.name ?? '');
  const isAdmin = props.detail.admins.includes(me.value?.name ?? '');

  const canViewResultMatrix: Record<ResShareType, boolean> = {
    anyone: true,
    respondents: isRespondent || isAdmin,
    admins: isAdmin,
  };

  return canViewResultMatrix[props.detail.response_viewable_by];
});
</script>

<template>
  <div class="questionnaire-actions-container">
    <Button
      class="questionnaire-action-button"
      :disabled="!canRespond"
      @click="
        $router.push(`/questionnaires/${detail.questionnaire_id}/responses/new`)
      "
    >
      <Icon name="mdi:send" size="24px" />
      <span>回答する</span>
    </Button>
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
    <Button
      class="questionnaire-action-button"
      outlined
      :disabled="!canViewResult"
      @click="$router.push(`/questionnaires/${detail.questionnaire_id}/result`)"
    >
      <Icon name="mdi:text-box-multiple-outline" size="24px" />
      <span>結果を見る</span>
    </Button>
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

.questionnaire-action-button {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
}
</style>
