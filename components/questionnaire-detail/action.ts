import { useStoreNewQuestionnaireForm } from "~/components/questionnaire-form/store";

import {
  deleteQuestionnaireById,
  patchMyRemindStatus,
  type PatchMyRemindStatusBody,
  type PatchQuestionnaireBody,
  patchQuestionnaireById,
} from "~/composables/type-fetch/anke-to/client";
import type { QuestionnaireDetail } from "./type";

export const actionRespondLater = async (questionnaireId: number) => {
  const body: PatchMyRemindStatusBody = {
    is_remind_enabled: true,
  };
  try {
    await patchMyRemindStatus(questionnaireId, body);
  } catch (err) {
    console.error(err);
    alert("予期せぬエラーが発生しました");
  }
};

export const actionNotRespond = async (questionnaireId: number) => {
  const body: PatchMyRemindStatusBody = {
    is_remind_enabled: false,
  };
  try {
    await patchMyRemindStatus(questionnaireId, body);
  } catch (err) {
    console.error(err);
    alert("予期せぬエラーが発生しました");
  }
};

export const actionDelete = async (detail: QuestionnaireDetail) => {
  if (
    !confirm(
      `本当に「${detail.title}」を削除しますか？ (この操作は取り消せません)`,
    )
  ) return;
  try {
    await deleteQuestionnaireById(detail.questionnaire_id);
    await navigateTo("/explorer");
  } catch (err) {
    console.error(err);
    // TODO: handle error
    alert("アンケートの削除に失敗しました。");
  }
};

export const actionClose = async (detail: QuestionnaireDetail) => {
  const body: PatchQuestionnaireBody = {
    ...detail,
    response_due_date_time: toISOStringWithTZ(new Date()),
  };
  try {
    await patchQuestionnaireById(detail.questionnaire_id, body);
  } catch (err) {
    console.error(err);
    // TODO: handle error
    alert("予期せぬエラーが発生しました");
  }
};

export const actionDuplicate = async (
  detail: QuestionnaireDetail,
) => {
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

  await navigateTo("/questionnaires/new");
};
