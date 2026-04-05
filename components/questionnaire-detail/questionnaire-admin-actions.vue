<script lang="ts" setup>
import { useMe } from '~/composables/type-fetch/anke-to/client';
import { useQuestionnaireActions } from './action';
import type { QuestionnaireDetail } from './type';

const props = defineProps<{ detail: QuestionnaireDetail }>();

const { data: me } = useMe();
const { actionDelete, actionClose, actionDuplicate } =
  useQuestionnaireActions();

const canEdit = computed(() =>
  props.detail.admins.includes(me.value?.name ?? ''),
);

const canAnswer = computed(
  () =>
    props.detail.response_due_date_time === undefined ||
    new Date(props.detail.response_due_date_time) > new Date(),
);
</script>

<template>
  <div class="questionnaire-admin-actions-container">
    <div class="questionnaire-admin-actions-main">
      <Button
        class="questionnaire-action-button"
        :disabled="!canEdit"
        @click="$router.push(`/questionnaires/${detail.questionnaire_id}/edit`)"
      >
        <Icon name="mdi:pencil-outline" size="24px" />
        <span>編集する</span>
      </Button>
      <Button
        class="questionnaire-action-button"
        outlined
        :disabled="!canEdit || !canAnswer"
        @click="actionClose(detail)"
      >
        <Icon name="mdi:alarm-check" size="24px" />
        <span>締め切る</span>
      </Button>
      <Button
        class="questionnaire-action-button"
        outlined
        @click="actionDuplicate(detail)"
      >
        <Icon name="mdi:content-copy" size="24px" />
        <span>複製する</span>
      </Button>
    </div>
    <div class="questionnaire-admin-actions-danger-zone">
      <Button
        class="questionnaire-action-button questionnaire-action-button-danger"
        severity="danger"
        :disabled="!canEdit"
        @click="actionDelete(detail)"
      >
        <Icon name="mdi:trash-can-outline" size="24px" />
        <span>削除する</span>
      </Button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.questionnaire-admin-actions-container {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.questionnaire-admin-actions-main {
  display: grid;
  gap: 16px;
  grid-template-columns: repeat(3, minmax(0, 1fr));
}

@container (max-width: 740px) {
  .questionnaire-admin-actions-main {
    grid-template-columns: 1fr 1fr;
  }
}

@container (max-width: 360px) {
  .questionnaire-admin-actions-main {
    grid-template-columns: 1fr;
  }
}

.questionnaire-admin-actions-danger-zone {
  display: flex;
  justify-content: flex-end;
}

@container (max-width: 740px) {
  .questionnaire-admin-actions-danger-zone {
    justify-content: flex-start;
  }
}

.questionnaire-action-button {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
}

.questionnaire-action-button-danger {
  width: auto;
  min-width: 180px;
}
</style>
