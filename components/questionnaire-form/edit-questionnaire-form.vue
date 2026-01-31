<script lang="ts" setup>
import { convertToBody } from '~/components/questionnaire-form/converter';
import IconButton from '~/components/ui/icon-button.vue';
import { postNewQuestionnaire } from '~/composables/type-fetch/anke-to/client';
import type { GatewayQuestionnaire } from '~/models/questionnaire';
import QuestionnaireFormBase from './questionnaire-form-base.vue';
import { checkValidity } from './store';

const props = defineProps<{
  questionnaire: GatewayQuestionnaire;
}>();

const state = reactive({
  ...props.questionnaire,
  questions: props.questionnaire.questions.map((q) => ({
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
    const result = await postNewQuestionnaire(
      convertToBody({ ...state, is_published: false }),
    );
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
