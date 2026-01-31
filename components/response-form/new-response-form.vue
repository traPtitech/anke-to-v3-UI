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
  } catch (err) {
    // TODO: handle error
    console.error(err);
    alert('回答の一時保存に失敗しました。');
  }
};

const handleSend = async () => {
  if (!valid.value) {
    alert('必須項目を回答していません');
    return;
  }
  try {
    const result = await postNewResponse(props.questionnaire.questionnaire_id, {
      ...convertToBody(state.value),
      is_draft: true,
    });
    if (!result) {
      throw new Error('Failed to send response');
    }
    await navigateTo({
      path: `/responses/${result.response_id}`,
    });
  } catch (err) {
    // TODO: handle error
    console.error(err);
    alert('回答の送信に失敗しました。');
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
