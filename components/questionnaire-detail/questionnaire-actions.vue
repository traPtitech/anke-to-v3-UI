<script lang="ts" setup>
import ButtonLink from '~/components/ui/button-link.vue';
import {
  useGetMyRemindStatus,
  useMe,
} from '~/composables/type-fetch/anke-to/client';
import { useQuestionnaireActions } from './action';
import type { QuestionnaireDetail, ResShareType } from './type';

const props = defineProps<{
  detail: QuestionnaireDetail;
  myResponses: {
    response_id: number;
    modified_at: string;
    is_draft: boolean;
  }[];
}>();

const { data: me } = useMe();
const { actionRespondLater, actionNotRespond } = useQuestionnaireActions();
const { data: myRemindStatus } = useGetMyRemindStatus(
  props.detail.questionnaire_id,
);

const latestDraft = computed(() => {
  const drafts = props.myResponses.filter((r) => r.is_draft);
  if (drafts.length === 0) return null;
  return drafts.reduce(
    (latest, current) =>
      new Date(current.modified_at) > new Date(latest.modified_at)
        ? current
        : latest,
    drafts[0],
  );
});

const canRespond = computed(() => {
  if (
    !props.detail.is_duplicate_answer_allowed &&
    props.detail.respondents.includes(me.value?.name ?? '')
  )
    return false;

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

const isRemindEnabled = computed(
  () => myRemindStatus.value?.is_remind_enabled ?? false,
);

const remindSwitchId = computed(
  () => `questionnaire-remind-switch-${props.detail.questionnaire_id}`,
);

const handleRemindSwitchUpdate = (nextValue: boolean | undefined) => {
  const isEnabled = nextValue ?? false;

  if (isEnabled === isRemindEnabled.value) {
    return;
  }

  if (isEnabled) {
    void actionRespondLater(props.detail.questionnaire_id);
    return;
  }

  void actionNotRespond(props.detail.questionnaire_id);
};
</script>

<template>
  <div class="questionnaire-actions-container">
    <div class="questionnaire-actions-row-primary">
      <ButtonLink
        v-if="latestDraft && canRespond"
        variant="primary"
        :to="`/responses/${latestDraft.response_id}/edit`"
      >
        <Icon name="mdi:file-document-edit" size="20px" />
        <span>下書きの続きを書く</span>
      </ButtonLink>
      <ButtonLink
        v-else
        variant="primary"
        :to="`/questionnaires/${detail.questionnaire_id}/responses/new`"
        :disabled="!canRespond"
      >
        <Icon name="mdi:send" size="20px" />
        <span>回答する</span>
      </ButtonLink>
      <ButtonLink
        variant="secondary"
        :to="`/questionnaires/${detail.questionnaire_id}/result`"
        :disabled="!canViewResult"
      >
        <Icon name="mdi:text-box-multiple-outline" size="20px" />
        <span>結果を見る</span>
      </ButtonLink>
    </div>
    <div class="questionnaire-actions-row-secondary">
      <ButtonLink
        variant="secondary"
        size="sm"
        :to="`/questionnaires/${detail.questionnaire_id}/questions`"
      >
        <Icon name="mdi:format-list-bulleted" size="18px" />
        <span>質問一覧を見る</span>
      </ButtonLink>
      <div class="remind-switch-item">
        <ToggleSwitch
          :input-id="remindSwitchId"
          :disabled="!canRespond"
          :model-value="isRemindEnabled"
          @update:model-value="handleRemindSwitchUpdate"
        />
        <label class="remind-switch-label" :for="remindSwitchId">
          このアンケートに関するリマインドを受け取る
        </label>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.questionnaire-actions-container {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.questionnaire-actions-row-primary {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 8px;
}

.questionnaire-actions-row-secondary {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}

.questionnaire-action-button {
  display: flex;
  align-items: center;
  gap: 8px;
  flex: 1;
  justify-content: center;
}

.remind-switch-item {
  display: inline-flex;
  align-items: center;
  gap: 10px;
}

.remind-switch-label {
  font-size: 14px;
  font-weight: 500;
  color: var(--p-text-color);
  cursor: pointer;
}

@container (max-width: 480px) {
  .questionnaire-actions-row-primary {
    grid-template-columns: 1fr;
  }
}
</style>
