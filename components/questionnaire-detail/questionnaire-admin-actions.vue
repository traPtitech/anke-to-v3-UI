<script lang="ts" setup>
import { actionClose, actionDelete, actionDuplicate } from './action';
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

const canEdit = computed(() => {
  if (!me.value) return false;
  return adminUsers.value.includes(me.value.name);
});
</script>

<template>
  <div class="questionnaire-actions-container">
    <router-link
      :to="canEdit ? `/questionnaires/${detail.questionnaire_id}/edit` : ''"
      class="questionnaire-action-button-link"
      :aria-disabled="!canEdit"
    >
      <Button class="questionnaire-action-button" :disabled="!canEdit">
        <Icon name="mdi:pencil-outline" size="24px" />
        <span>編集する</span>
      </Button>
    </router-link>
    <Button
      class="questionnaire-action-button"
      outlined
      :disabled="!canEdit"
      @click="actionDelete(detail.questionnaire_id)"
    >
      <Icon name="mdi:trash-can-outline" size="24px" />
      <span>削除する</span>
    </Button>
    <Button
      class="questionnaire-action-button"
      outlined
      :disabled="!canEdit"
      @click="actionClose(detail)"
    >
      <Icon name="mdi:alarm-check" size="24px" />
      <span>締め切る</span>
    </Button>
    <Button
      class="questionnaire-action-button"
      outlined
      @click="actionDuplicate(detail, $router)"
    >
      <Icon name="mdi:content-copy" size="24px" />
      <span>複製する</span>
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
