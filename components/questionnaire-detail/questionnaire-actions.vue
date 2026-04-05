<script lang="ts" setup>
import {
  useGetMyRemindStatus,
  useGetQuestionnaireResponses,
  useMe,
} from '~/composables/type-fetch/anke-to/client';
import { useQuestionnaireActions } from './action';
import type { QuestionnaireDetail, ResShareType } from './type';

const props = defineProps<{ detail: QuestionnaireDetail }>();

const { data: me } = useMe();
const { actionRespondLater, actionNotRespond } = useQuestionnaireActions();
const { data: myRemindStatus } = useGetMyRemindStatus(
  props.detail.questionnaire_id,
);

const { data: responses } = useGetQuestionnaireResponses(
  props.detail.questionnaire_id,
  {
    onlyMyResponse: true,
  },
);

const latestDraft = computed(() => {
  if (!responses.value) return null;
  const drafts = responses.value.filter((r) => r.is_draft);
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
</script>

<template>
  <div class="questionnaire-actions-container">
    <div class="questionnaire-actions-row questionnaire-actions-row-primary">
      <Button
        v-if="latestDraft"
        class="questionnaire-action-button questionnaire-action-button-respond"
        severity="warn"
        :disabled="!canRespond"
        @click="$router.push(`/responses/${latestDraft.response_id}/edit`)"
      >
        <Icon name="mdi:file-document-edit" size="20px" />
        <span>下書きの続きを書く</span>
      </Button>
      <Button
        v-else
        class="questionnaire-action-button questionnaire-action-button-respond"
        severity="danger"
        :disabled="!canRespond"
        @click="
          $router.push(
            `/questionnaires/${detail.questionnaire_id}/responses/new`,
          )
        "
      >
        <Icon name="mdi:send" size="20px" />
        <span>回答する</span>
      </Button>
      <Button
        class="questionnaire-action-button"
        outlined
        severity="secondary"
        :disabled="!canViewResult"
        @click="
          $router.push(`/questionnaires/${detail.questionnaire_id}/result`)
        "
      >
        <Icon name="mdi:text-box-multiple-outline" size="20px" />
        <span>結果を見る</span>
      </Button>
    </div>
    <div class="questionnaire-actions-row questionnaire-actions-row-secondary">
      <Button
        class="questionnaire-action-link"
        text
        size="small"
        severity="secondary"
        @click="
          isRemindEnabled
            ? actionNotRespond(detail.questionnaire_id)
            : actionRespondLater(detail.questionnaire_id)
        "
      >
        <span class="action-icon-wrapper" :class="{ 'is-canceled': isRemindEnabled }">
          <Icon name="mdi:send-clock" size="16px" />
        </span>
        <span v-if="isRemindEnabled">リマインドしない</span>
        <span v-else>後で回答する</span>
      </Button>

      <span class="action-divider">|</span>
      <Button
        class="questionnaire-action-link"
        text
        size="small"
        severity="secondary"
        disabled
        @click="actionNotRespond(detail.questionnaire_id)"
      >
        <Icon name="mdi:flag" size="16px" />
        <span>回答しない</span>
      </Button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.questionnaire-actions-container {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.questionnaire-actions-row-primary {
  display: flex;
  gap: 12px;
}

.questionnaire-actions-row-secondary {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 4px;
}

.action-divider {
  color: var(--p-surface-300);
  font-size: 14px;
  user-select: none;
}

.questionnaire-action-button {
  display: flex;
  align-items: center;
  gap: 8px;
  flex: 1;
  justify-content: center;
}

.questionnaire-action-button-respond {
  flex: 1.5;
}

.questionnaire-action-link {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 0;
  font-size: 13px;
}

.action-icon-wrapper {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.action-icon-wrapper.is-canceled::after {
  content: '';
  position: absolute;
  top: 50%;
  left: -10%;
  width: 120%;
  height: 1.5px;
  background-color: currentColor;
  transform: translateY(-50%) rotate(-45deg);
  border-radius: 2px;
}

@container (max-width: 400px) {
  .questionnaire-actions-row-primary {
    flex-direction: column;
  }

  .questionnaire-action-button {
    width: 100%;
  }
}
</style>
