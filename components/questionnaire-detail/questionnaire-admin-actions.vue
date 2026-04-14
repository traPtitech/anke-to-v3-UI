<script lang="ts" setup>
import ButtonLink from '~/components/ui/button-link.vue';
import { useMe } from '~/composables/type-fetch/anke-to/client';
import { useQuestionnaireActions } from './action';
import type { QuestionnaireDetail } from './type';

const props = defineProps<{ detail: QuestionnaireDetail }>();

const { data: me } = useMe();
const { actionDelete, actionClose } = useQuestionnaireActions();

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
      <Icon name="mdi:shield-account-outline" size="18px" />
      <span>管理</span>
    </h3>
    <div class="admin-actions-body">
      <ButtonLink
        variant="secondary"
        :to="`/questionnaires/${detail.questionnaire_id}/edit`"
        :disabled="!canEdit"
      >
        <Icon name="mdi:pencil-outline" size="20px" />
        <span>編集する</span>
      </ButtonLink>
      <Button
        severity="secondary"
        outlined
        :disabled="!canEdit || !canAnswer"
        @click="actionClose(detail)"
        title="締め切る"
        aria-label="締め切る"
      >
        <Icon name="mdi:alarm-check" size="20px" />
      </Button>
      <Button
        class="admin-action-btn-danger"
        severity="warn"
        outlined
        :disabled="!canEdit"
        @click="actionDelete(detail)"
        title="削除する"
        aria-label="削除する"
      >
        <Icon name="mdi:trash-can-outline" size="20px" />
      </Button>
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
  font-size: 15px;
  font-weight: 700;
  color: var(--p-text-color);
  margin: 0;
}

.admin-actions-body {
  gap: 8px;
  display: grid;
  grid-template-columns: 1fr auto auto;
}

.admin-action-btn-danger {
  border-color: var(--p-orange-400);
  color: var(--p-orange-600);
}

.admin-action-btn-danger:hover:not(:disabled) {
  background-color: var(--p-orange-50);
  border-color: var(--p-orange-500);
}

@container (max-width: 600px) {
  .admin-actions-body {
    grid-template-columns: 1fr;
  }
}
</style>
