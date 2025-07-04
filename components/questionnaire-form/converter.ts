import type { QuestionnaireFormSettings } from "~/components/questionnaire-form/type";
import type { PostQuestionnaireBody } from "~/composables/type-fetch/anke-to/client";

export const convertToBody = (
  state: QuestionnaireFormSettings,
): PostQuestionnaireBody => ({
  ...state,
  questions: state.questions.map((q) => ({
    ...q,
    // createId() で生成されたID を undefined に変換
    question_id: q.question_id >= 0 ? q.question_id : undefined,
  })),
});
