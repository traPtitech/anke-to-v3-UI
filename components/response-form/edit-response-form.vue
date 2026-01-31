<script lang="ts" setup>
import IconButton from '~/components/ui/icon-button.vue';
import { patchResponse } from '~/composables/type-fetch/anke-to/client';
import type { GatewayQuestionnaire } from '~/models/questionnaire';
import type { GatewayResponse } from '~/models/response';
import ResponseFormBase from './response-form-base.vue';
import {
  convertToBody,
  getExistingResponseFormState,
  useResponseFormStore,
} from './store';

const props = defineProps<{
  questionnaire: GatewayQuestionnaire;
  response: GatewayResponse;
}>();

const initialState = getExistingResponseFormState(
  props.questionnaire,
  props.response,
);
const { state, valid } = useResponseFormStore(initialState);

const handleSave = async () => {
  try {
    await patchResponse(state.value.response_id, {
      ...convertToBody(state.value),
      is_draft: true,
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
    await patchResponse(state.value.response_id, {
      ...convertToBody(state.value),
      is_draft: false,
    });
    await navigateTo({
      path: `/responses/${state.value.response_id}`,
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
