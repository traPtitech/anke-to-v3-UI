<script lang="ts" setup>
import IconButton from '~/components/ui/icon-button.vue';
import { postNewQuestionnaire } from '~/composables/type-fetch/anke-to/client';
import { convertToBody } from './converter';
import QuestionnaireFormBase from './questionnaire-form-base.vue';
import { checkValidity, useStoreNewQuestionnaireForm } from './store';

const toast = useToast();

const { state } = useStoreNewQuestionnaireForm();
const isValidQuestionnaire = computed(() => checkValidity(state).ok);
const me = await useMe();

onMounted(() => {
  if (me.value === null) return;
  state.admin.users = [me.value.name];
});

const handleSave = async () => {
  if (state.title.trim() === '') {
    toast.add({
      summary: 'アンケートのタイトルを入力してください。',
      severity: 'error',
      life: 3000,
    });
    return;
  }
  try {
    const result = await postNewQuestionnaire(
      convertToBody({ ...state, is_published: false }),
    );
    if (!result) {
      throw new Error('Failed to create questionnaire');
    }
    await navigateTo({
      path: `/questionnaires/${result.questionnaire_id}/edit`,
    });
    toast.add({
      summary: 'アンケートを保存しました',
      severity: 'success',
      life: 3000,
    });
  } catch (err) {
    console.error(err);
    toast.add({
      summary: 'アンケートの一時保存に失敗しました',
      severity: 'error',
      life: 3000,
    });
  }
};

const handleSend = async () => {
  const validity = checkValidity(state);
  if (!validity.ok) {
    toast.add({
      summary: validity.message,
      severity: 'error',
      life: 3000,
    });
    return;
  }

  try {
    const result = await postNewQuestionnaire(
      convertToBody({ ...state, is_published: true }),
    );
    if (!result) {
      throw new Error('Failed to create questionnaire');
    }
    await navigateTo({
      path: `/questionnaires/${result.questionnaire_id}`,
    });
    toast.add({
      summary: 'アンケートを送信しました',
      severity: 'success',
      life: 3000,
    });
  } catch (err) {
    console.error(err);
    toast.add({
      summary: 'アンケートの送信に失敗しました',
      severity: 'error',
      life: 3000,
    });
  }
};
</script>

<template>
  <QuestionnaireFormBase v-model="state">
    <template #buttons>
      <IconButton variant="secondary" icon="mdi:close" @click="handleSave">
        <span>一時保存</span>
      </IconButton>
      <IconButton
        variant="primary"
        icon="mdi:content-save"
        :disabled="!isValidQuestionnaire"
        @click="handleSend"
      >
        <span>送信</span>
      </IconButton>
    </template>
  </QuestionnaireFormBase>
</template>
