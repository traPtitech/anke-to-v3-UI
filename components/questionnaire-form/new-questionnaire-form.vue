<script lang="ts" setup>
import { postNewQuestionnaire } from '~/composables/type-fetch/anke-to/client';
import { convertToBody } from './converter';
import { checkValidity, useStoreNewQuestionnaireForm } from './store';

const { state } = useStoreNewQuestionnaireForm();
const me = await useMe();

onMounted(() => {
  if (me.value === null) return;
  state.admin.users = [me.value.name];
});

const handleSave = async () => {
  if (state.title.trim() === '') {
    alert('アンケートのタイトルを入力してください。');
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
  } catch (err) {
    console.error(err);
    alert('アンケートの一時保存に失敗しました。');
  }
};

const handleSend = async () => {
  const validity = checkValidity(state);
  if (validity.ok) {
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
    } catch (err) {
      console.error(err);
      alert('アンケートの作成に失敗しました。');
    }
  } else {
    // TODO: handle error
    alert(validity.message);
  }
};
</script>

<template>
  <QuestionnaireFormBase v-model="state">
    <template #buttons>
      <IconButton variant="secondary" icon="mdi:close" @click="handleSave">
        <span>一時保存</span>
      </IconButton>
      <IconButton variant="primary" icon="mdi:content-save" @click="handleSend">
        <span>送信</span>
      </IconButton>
    </template>
  </QuestionnaireFormBase>
</template>
