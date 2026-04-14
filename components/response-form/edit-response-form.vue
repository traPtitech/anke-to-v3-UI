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

const toast = useToast();

const props = defineProps<{
  questionnaire: GatewayQuestionnaire;
  response: GatewayResponse;
}>();

const initialState = getExistingResponseFormState(
  props.questionnaire,
  props.response,
);
const { state, valid, atLeastOneFilled } = useResponseFormStore(initialState);
const isEditingDraft = computed(() => props.response.is_draft);
const saveButtonLabel = computed(() =>
  isEditingDraft.value ? '一時保存' : '下書きに戻す',
);
const saveButtonIcon = computed(() =>
  isEditingDraft.value ? 'mdi:close' : 'mdi:file-undo-outline',
);

const handleSave = async () => {
  if (!atLeastOneFilled.value) {
    toast.add({
      summary: '少なくとも1つの質問に回答してください',
      severity: 'error',
      life: 3000,
    });
    return;
  }

  try {
    // patchResponse の後だと既に isEditingDraft が変わってしまっている場合がある
    const isEditingDraftSnapshot = isEditingDraft.value;
    await patchResponse(state.value.response_id, {
      ...convertToBody(state.value),
      is_draft: true,
    });
    toast.add({
      summary: isEditingDraftSnapshot
        ? '回答を一時保存しました'
        : '回答を下書きに戻しました',
      severity: 'success',
      life: 3000,
    });
  } catch (err) {
    console.error(err);
    toast.add({
      summary: isEditingDraft.value
        ? '回答の一時保存に失敗しました'
        : '回答を下書きに戻せませんでした',
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

  if (!atLeastOneFilled.value) {
    toast.add({
      summary: '少なくとも1つの質問に回答してください',
      severity: 'error',
      life: 3000,
    });
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
      <IconButton
        variant="secondary"
        :icon="saveButtonIcon"
        :disabled="!atLeastOneFilled"
        :title="
          !atLeastOneFilled ? '少なくとも1つの質問に回答してください' : ''
        "
        @click="handleSave"
      >
        <span>{{ saveButtonLabel }}</span>
      </IconButton>
      <IconButton
        variant="primary"
        icon="mdi:content-save"
        :disabled="!valid || !atLeastOneFilled"
        :title="
          !atLeastOneFilled
            ? '少なくとも1つの質問に回答してください'
            : !valid
              ? '必須項目を回答してください'
              : ''
        "
        @click="handleSend"
      >
        <span>送信</span>
      </IconButton>
    </template>
  </ResponseFormBase>
</template>
