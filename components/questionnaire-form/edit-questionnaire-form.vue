<script lang="ts" setup>
import {
  postNewQuestionnaire,
  useGetQuestionnaire,
} from '~/composables/type-fetch/anke-to/client';
import { checkValidity } from './store';

const props = defineProps<{
  id: number;
}>();

const { data } = await useGetQuestionnaire(props.id);
if (!data.value) {
  throw new Error('Questionnaire not found');
}
const state = reactive({
  ...data.value,
  questions: data.value.questions.map((q) => ({
    ...q,
    // 既にある質問なので question_id は必ず存在する
    question_id: q.question_id!,
  })),
});

const handleSave = async () => {
  if (state.title.trim() === '') {
    alert('アンケートのタイトルを入力してください。');
    return;
  }
  try {
    const result = await postNewQuestionnaire({
      ...state,
      is_published: false,
    });
    if (!result) {
      throw new Error('Failed to create questionnaire');
    }
  } catch (err) {
    console.error(err);
    alert('アンケートの一時保存に失敗しました。');
  }
};

const handleSend = async () => {
  const validity = checkValidity(state);
  if (validity.ok) {
    try {
      const result = await postNewQuestionnaire({
        ...state,
        is_published: true,
      });
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
