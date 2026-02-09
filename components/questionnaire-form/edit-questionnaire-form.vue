<script lang="ts" setup>
import { convertToBody } from '~/components/questionnaire-form/converter';
import IconButton from '~/components/ui/icon-button.vue';
import { patchQuestionnaireById } from '~/composables/type-fetch/anke-to/client';
import type { GatewayQuestionnaire } from '~/models/questionnaire';
import QuestionnaireFormBase from './questionnaire-form-base.vue';
import { checkValidity } from './store';

const toast = useToast();

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
const isValidQuestionnaire = computed(() => checkValidity(state).ok);

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
    await patchQuestionnaireById(props.questionnaire.questionnaire_id, {
      ...convertToBody({ ...state, is_published: false }),
      questionnaire_id: props.questionnaire.questionnaire_id,
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
    await patchQuestionnaireById(props.questionnaire.questionnaire_id, {
      ...convertToBody({ ...state, is_published: true }),
      questionnaire_id: props.questionnaire.questionnaire_id,
    });
    await navigateTo({
      path: `/questionnaires/${props.questionnaire.questionnaire_id}`,
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
