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
  <div class="admin-actions-container">
    <h3 class="admin-actions-title">
      <Icon name="mdi:shield-account-outline" size="16px" />
      <span>管理</span>
    </h3>
    <div class="admin-actions-body">
      <div class="admin-actions-main">
        <Button
          class="admin-action-btn"
          size="small"
          outlined
          :disabled="!canEdit"
          @click="
            $router.push(`/questionnaires/${detail.questionnaire_id}/edit`)
          "
        >
          <Icon name="mdi:pencil-outline" size="18px" />
          <span>編集する</span>
        </Button>
        <Button
          class="admin-action-btn"
          size="small"
          outlined
          :disabled="!canEdit || !canAnswer"
          @click="actionClose(detail)"
        >
          <Icon name="mdi:alarm-check" size="18px" />
          <span>締め切る</span>
        </Button>
        <Button
          class="admin-action-btn"
          size="small"
          outlined
          :disabled="!canEdit"
          @click="actionDuplicate(detail)"
        >
          <Icon name="mdi:content-copy" size="18px" />
          <span>複製する</span>
        </Button>
      </div>
      <div class="admin-actions-danger">
        <Button
          class="admin-action-btn admin-action-btn-danger"
          size="small"
          severity="warn"
          outlined
          :disabled="!canEdit"
          @click="actionDelete(detail)"
        >
          <Icon name="mdi:trash-can-outline" size="18px" />
          <span>削除する</span>
        </Button>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.admin-actions-container {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.admin-actions-title {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  font-weight: 700;
  color: var(--p-text-muted-color);
  margin: 0;
}

.admin-actions-body {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
}

.admin-actions-main {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.admin-actions-danger {
  margin-left: auto;
}

.admin-action-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
}

.admin-action-btn-danger {
  border-color: var(--p-orange-400);
  color: var(--p-orange-600);
}

.admin-action-btn-danger:hover:not(:disabled) {
  background-color: var(--p-orange-50);
  border-color: var(--p-orange-500);
}

@container (max-width: 500px) {
  .admin-actions-body {
    flex-direction: column;
    align-items: flex-start;
  }

  .admin-actions-danger {
    margin-left: 0;
  }
}
</style>
