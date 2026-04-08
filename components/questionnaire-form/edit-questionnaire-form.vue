<script lang="ts" setup>
import { convertToBody } from '~/components/questionnaire-form/converter';
import ButtonLink from '~/components/ui/button-link.vue';
import IconButton from '~/components/ui/icon-button.vue';
import { patchQuestionnaireById } from '~/composables/type-fetch/anke-to/client';
import type { GatewayQuestionnaire } from '~/models/questionnaire';
import QuestionnaireFormBase from './questionnaire-form-base.vue';
import { checkValidity, getValidationErrors } from './store';

const toast = useToast();

const props = defineProps<{
  questionnaire: GatewayQuestionnaire;
}>();

const createEditableState = () => ({
  ...props.questionnaire,
  questions: props.questionnaire.questions.map((q) => ({
    ...q,
    // 既にある質問なので question_id は必ず存在する
    question_id: q.question_id!,
  })),
});

const state = reactive(createEditableState());
const isValidQuestionnaire = computed(() => checkValidity(state).ok);
const savedSnapshot = ref(JSON.stringify(state));
const isDirty = computed(() => JSON.stringify(state) !== savedSnapshot.value);

const handleBackToDetail = async () => {
  if (isDirty.value) {
    const shouldLeave = confirm(
      '保存していない変更は破棄されます。アンケート詳細画面に戻りますか？',
    );
    if (!shouldLeave) return;
  }

  await navigateTo(`/questionnaires/${props.questionnaire.questionnaire_id}`);
};

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
    savedSnapshot.value = JSON.stringify(state);
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
  const validationErrors = getValidationErrors(state);
  if (validationErrors.length > 0) {
    validationErrors
      .filter(({ display }) => display)
      .forEach(({ message }) => {
        toast.add({
          summary: message,
          severity: 'error',
          life: 3000,
        });
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
  <div class="edit-questionnaire-container">
    <div class="edit-questionnaire-nav">
      <ButtonLink
        :to="`/questionnaires/${props.questionnaire.questionnaire_id}`"
        class="edit-back-link"
        variant="secondary"
        size="sm"
        @click.prevent="handleBackToDetail"
      >
        <Icon name="mdi:chevron-left" size="20px" />
        <span>アンケート詳細に戻る</span>
      </ButtonLink>
    </div>

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
  </div>
</template>

<style scoped lang="scss">
.edit-questionnaire-container {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.edit-questionnaire-nav {
  display: flex;
  align-items: center;
  width: 100%;
  max-width: 1080px;
  margin: 0 auto;
}

.edit-back-link {
  width: fit-content;
  font-weight: 600;
}
</style>
