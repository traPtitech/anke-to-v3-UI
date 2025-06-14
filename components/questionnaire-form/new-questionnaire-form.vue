<script lang="ts" setup>
import { postNewQuestionnaire } from '~/composables/type-fetch/anke-to/client';
import { convertToBody } from './converter';
import { checkValidity, useStoreNewQuestionnaireForm } from './store';

const { state } = useStoreNewQuestionnaireForm();

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
      <Button outlined class="form-action-button" @click="handleSave">
        <Icon name="mdi:content-save" size="24px" />
        <span>一時保存</span>
      </Button>
      <Button class="form-action-button" @click="handleSend">
        <Icon name="mdi:send" size="24px" />
        <span>送信</span>
      </Button>
    </template>
  </QuestionnaireFormBase>
</template>

<style scoped lang="scss">
.form-action-button {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-weight: bold;
}
</style>
