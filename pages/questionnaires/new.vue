<script lang="ts" setup>
import type { NewQuestionnaireFormSettings } from '~/components/new-questionnaire-form/type';
import { postNewQuestionnaire } from '~/composables/type-fetch/anke-to/client';

const saveHandler = async (form: NewQuestionnaireFormSettings) => {
  try {
    const result = await postNewQuestionnaire({ ...form, is_published: false });
    if (!result) {
      throw new Error('Failed to create questionnaire');
    }
    await navigateTo({
      path: `/questionnaires/${result?.questionnaire_id}/edit`,
    });
  } catch (err) {
    console.error(err);
    alert('アンケートの一時保存に失敗しました。');
  }
};

const sendHandler = async (form: NewQuestionnaireFormSettings) => {
  try {
    const result = await postNewQuestionnaire({ ...form, is_published: true });
    if (!result) {
      throw new Error('Failed to create questionnaire');
    }
    await navigateTo({
      path: `/questionnaires/${result?.questionnaire_id}`,
    });
  } catch (err) {
    console.error(err);
    alert('アンケートの作成に失敗しました。');
  }
};
</script>

<template>
  <div>
    <NewQuestionnaireForm @save="saveHandler" @send="sendHandler" />
  </div>
</template>
