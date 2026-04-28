import { useStoreNewQuestionnaireForm } from '~/components/questionnaire-form/store';

import {
  closeQuestionnaire,
  deleteQuestionnaireById,
  patchMyRemindStatus,
  type PatchMyRemindStatusBody,
} from '~/composables/type-fetch/anke-to/client';
import type { QuestionnaireDetail } from './type';

export const useQuestionnaireActions = () => {
  const toast = useToast();

  const actionRespondLater = async (questionnaireId: number) => {
    const body: PatchMyRemindStatusBody = {
      is_remind_enabled: true,
    };
    try {
      await patchMyRemindStatus(questionnaireId, body);
      toast.add({
        summary: 'このアンケートのリマインドを受け取る設定にしました',
        severity: 'success',
        life: 3000,
      });
    } catch (err) {
      console.error(err);
      toast.add({
        summary: '回答設定の更新に失敗しました',
        severity: 'error',
        life: 3000,
      });
    }
  };

  const actionNotRespond = async (questionnaireId: number) => {
    const body: PatchMyRemindStatusBody = {
      is_remind_enabled: false,
    };
    try {
      await patchMyRemindStatus(questionnaireId, body);
      toast.add({
        summary: 'このアンケートのリマインドを受け取らない設定にしました',
        severity: 'success',
        life: 3000,
      });
    } catch (err) {
      console.error(err);
      toast.add({
        summary: '回答設定の更新に失敗しました',
        severity: 'error',
        life: 3000,
      });
    }
  };

  const actionDelete = async (detail: QuestionnaireDetail) => {
    if (!confirm(`本当に「${detail.title}」を削除しますか？ (この操作は取り消せません)`)) {
      return;
    }
    try {
      await deleteQuestionnaireById(detail.questionnaire_id);
      await navigateTo('/explorer');
      toast.add({
        summary: 'アンケートを削除しました。',
        severity: 'success',
        life: 3000,
      });
    } catch (err) {
      console.error(err);
      toast.add({
        summary: 'アンケートの削除に失敗しました。',
        severity: 'error',
        life: 3000,
      });
    }
  };
  const actionClose = async (detail: QuestionnaireDetail) => {
    try {
      await closeQuestionnaire(detail.questionnaire_id);
      toast.add({
        summary: 'アンケートを締め切りました。',
        severity: 'success',
        life: 3000,
      });
    } catch (err) {
      console.error(err);
      toast.add({
        summary: 'アンケートの締め切り設定に失敗しました。',
        severity: 'error',
        life: 3000,
      });
    }
  };

  const actionDuplicate = async (detail: QuestionnaireDetail) => {
    const { state } = useStoreNewQuestionnaireForm();
    state.title = detail.title;
    state.description = detail.description;
    state.response_due_date_time = detail.response_due_date_time;
    state.admin = detail.admin;
    state.questions = detail.questions.map((q) => ({
      ...q,
      question_id: createId(),
    }));
    state.target = detail.target;
    state.is_anonymous = detail.is_anonymous;
    state.is_duplicate_answer_allowed = detail.is_duplicate_answer_allowed;
    state.response_viewable_by = detail.response_viewable_by;

    await navigateTo('/questionnaires/new');

    toast.add({
      summary: 'アンケートを複製しました。',
      severity: 'success',
      life: 3000,
    });
  };

  return {
    actionRespondLater,
    actionNotRespond,
    actionDelete,
    actionClose,
    actionDuplicate,
  };
};
