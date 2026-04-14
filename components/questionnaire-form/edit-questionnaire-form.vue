<script lang="ts" setup>
import { convertToBody } from '~/components/questionnaire-form/converter';
import ButtonLink from '~/components/ui/button-link.vue';
import IconButton from '~/components/ui/icon-button.vue';
import { patchQuestionnaireById } from '~/composables/type-fetch/anke-to/client';
import type { GatewayQuestionnaire } from '~/models/questionnaire';
import QuestionnaireFormBase from './questionnaire-form-base.vue';
import { checkValidity } from './store';

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
const isEditingDraft = computed(() => !state.is_published);
const saveButtonLabel = computed(() =>
  isEditingDraft.value ? '一時保存' : '下書きに戻す',
);
const saveButtonIcon = computed(() =>
  isEditingDraft.value ? 'mdi:close' : 'mdi:file-undo-outline',
);
const savedSnapshot = ref(JSON.stringify(state));
const isDirty = computed(() => JSON.stringify(state) !== savedSnapshot.value);

onBeforeRouteLeave((_to, _from, next) => {
  if (isDirty.value) {
    const shouldLeave = confirm(
      '保存していない変更は破棄されます。ページを離れますか？',
    );
    if (!shouldLeave) return;
  }
  next();
});

const handleBeforeUnload = (e: BeforeUnloadEvent) => {
  if (isDirty.value) {
    e.preventDefault();
  }
};

onMounted(() => {
  window.addEventListener('beforeunload', handleBeforeUnload);
});

onBeforeUnmount(() => {
  window.removeEventListener('beforeunload', handleBeforeUnload);
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
    const wasEditingDraft = isEditingDraft.value;
    await patchQuestionnaireById(props.questionnaire.questionnaire_id, {
      ...convertToBody({ ...state, is_published: false }),
      questionnaire_id: props.questionnaire.questionnaire_id,
    });
    state.is_published = false;
    toast.add({
      summary: wasEditingDraft
        ? 'アンケートを一時保存しました'
        : 'アンケートを下書きに戻しました',
      severity: 'success',
      life: 3000,
    });
    savedSnapshot.value = JSON.stringify(state);
  } catch (err) {
    console.error(err);
    toast.add({
      summary: isEditingDraft.value
        ? 'アンケートの一時保存に失敗しました'
        : 'アンケートを下書きに戻せませんでした',
      severity: 'error',
      life: 3000,
    });
  }
};

const handleSend = async () => {
  if (!isValidQuestionnaire.value) return;

  try {
    await patchQuestionnaireById(props.questionnaire.questionnaire_id, {
      ...convertToBody({ ...state, is_published: true }),
      questionnaire_id: props.questionnaire.questionnaire_id,
    });
    savedSnapshot.value = JSON.stringify(state);
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
    <div class="edit-questionnaire-nav-container">
      <div class="edit-questionnaire-nav">
        <ButtonLink
          :to="`/questionnaires/${props.questionnaire.questionnaire_id}`"
          variant="secondary"
          size="sm"
        >
          <Icon name="mdi:chevron-left" size="20px" />
          <span>アンケート詳細に戻る</span>
        </ButtonLink>
      </div>
    </div>

    <QuestionnaireFormBase v-model="state">
      <template #buttons>
        <IconButton
          variant="secondary"
          :icon="saveButtonIcon"
          @click="handleSave"
        >
          <span>{{ saveButtonLabel }}</span>
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

.edit-questionnaire-nav-container {
  padding-right: 176px;
}

.edit-questionnaire-nav {
  display: flex;
  align-items: center;
  width: 100%;
  max-width: 1080px;
  margin: 0 auto;
}

@media screen and (max-width: 1600px) {
  .edit-questionnaire-nav-container {
    padding-right: 0;
  }
}
</style>
