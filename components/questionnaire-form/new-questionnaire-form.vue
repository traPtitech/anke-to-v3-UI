<script lang="ts" setup>
import IconButton from '~/components/ui/icon-button.vue';
import {
  postNewQuestionnaire,
  useMe,
} from '~/composables/type-fetch/anke-to/client';
import { convertToBody } from './converter';
import QuestionnaireFormBase from './questionnaire-form-base.vue';
import {
  checkValidity,
  getValidationErrors,
  useStoreNewQuestionnaireForm,
} from './store';

const toast = useToast();

const newQuestionnaireFormStore = useStoreNewQuestionnaireForm();
const { state, isDirty } = storeToRefs(newQuestionnaireFormStore);
const { reset } = newQuestionnaireFormStore;
const isValidQuestionnaire = computed(() => checkValidity(state.value).ok);
const { data: me } = useMe();

onMounted(() => {
  if (me.value === undefined) return;
  if (state.value.admin.users.length > 0) return;
  state.value.admin.users = [me.value.name];
});

const handleReset = () => {
  if (confirm('この操作は取り消せません。本当に入力内容をリセットしますか？')) {
    reset(me.value?.name);
  }
};

const handleSave = async () => {
  if (state.value.title.trim() === '') {
    toast.add({
      summary: 'アンケートのタイトルを入力してください。',
      severity: 'error',
      life: 3000,
    });
    return;
  }

  try {
    const result = await postNewQuestionnaire(
      convertToBody({ ...state.value, is_published: false }),
    );
    if (!result) {
      throw new Error('Failed to create questionnaire');
    }
    reset(me.value?.name);
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
  const validationErrors = getValidationErrors(state.value);
  if (validationErrors.length > 0) return;

  try {
    const result = await postNewQuestionnaire(
      convertToBody({ ...state.value, is_published: true }),
    );
    if (!result) {
      throw new Error('Failed to create questionnaire');
    }
    reset(me.value?.name);
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
      <IconButton
        variant="secondary"
        icon="mdi:arrow-u-left-bottom"
        :disabled="!isDirty"
        @click="handleReset"
      >
        <span>リセット</span>
      </IconButton>
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
