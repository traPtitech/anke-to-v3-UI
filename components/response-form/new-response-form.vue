<script lang="ts" setup>
import IconButton from '~/components/ui/icon-button.vue';
import { postNewResponse } from '~/composables/type-fetch/anke-to/client';
import type { GatewayQuestionnaire } from '~/models/questionnaire';
import ResponseFormBase from './response-form-base.vue';
import {
  convertToBody,
  getInitialResponseFormState,
  useResponseFormStore,
} from './store';

const toast = useToast();

const props = defineProps<{
  questionnaire: GatewayQuestionnaire;
}>();

const initialState = getInitialResponseFormState(props.questionnaire);
const { state, valid } = useResponseFormStore(initialState);

const handleSave = async () => {
  try {
    const result = await postNewResponse(props.questionnaire.questionnaire_id, {
      ...convertToBody(state.value),
      is_draft: true,
    });
    if (!result) {
      throw new Error('Failed to save response');
    }
    await navigateTo({
      path: `/responses/${result.response_id}/edit`,
    });
    toast.add({
      summary: '回答を一時保存しました',
      severity: 'success',
      life: 3000,
    });
  } catch (err) {
    console.error(err);
    toast.add({
      summary: '回答の一時保存に失敗しました',
      severity: 'error',
      life: 3000,
    });
  }
};

const handleSend = async () => {
  if (!valid.value) {
    toast.add({
      summary: '必須項目を回答していません',
      severity: 'error',
      life: 3000,
    });
    return;
  }
  try {
    const result = await postNewResponse(props.questionnaire.questionnaire_id, {
      ...convertToBody(state.value),
      is_draft: false,
    });
    if (!result) {
      throw new Error('Failed to send response');
    }
    await navigateTo({
      path: `/responses/${result.response_id}`,
    });
    toast.add({
      summary: '回答を送信しました',
      severity: 'success',
      life: 3000,
    });
  } catch (err) {
    console.error(err);
    toast.add({
      summary: '回答の送信に失敗しました',
      severity: 'error',
      life: 3000,
    });
  }
};
</script>

<template>
  <ResponseFormBase v-model="state" :questionnaire="questionnaire">
    <template #buttons>
      <IconButton variant="secondary" icon="mdi:close" @click="handleSave">
        <span>一時保存</span>
      </IconButton>
      <IconButton variant="primary" icon="mdi:content-save" @click="handleSend">
        <span>送信</span>
      </IconButton>
    </template>
  </ResponseFormBase>
</template>
