import type { components } from "~/composables/type-fetch/anke-to/openapi";

export type GatewayQuestionnaire = components["schemas"]["QuestionnaireDetail"];

export type GatewayQuestionnaireSummary =
  components["schemas"]["QuestionnaireSummary"];

export type GatewayResponseShareType = components["schemas"]["ResShareType"];

export const responseViewableByOptionsMap = {
  anyone: "全体",
  respondents: "回答した人のみ",
  admins: "管理者のみ",
} satisfies Record<GatewayResponseShareType, string>;

export const formatResponseDueDateTime = (
  questionnaire: Pick<GatewayQuestionnaireSummary, "response_due_date_time">,
) => {
  const due = questionnaire.response_due_date_time;
  if (due === undefined) return "期限なし";
  const date = new Date(due);
  return formatRelativeDate(date);
};

export const checkIsDueOver = (
  questionnaire: Pick<GatewayQuestionnaireSummary, "response_due_date_time">,
) => {
  const due = questionnaire.response_due_date_time;
  if (due === undefined) return false;
  const date = new Date(due);
  return date.getTime() < Date.now();
};

export const canViewResults = (
  questionnaire: Pick<
    GatewayQuestionnaireSummary,
    | "is_published"
    | "response_viewable_by"
    | "is_administrated_by_me"
    | "has_my_response"
  >,
) => {
  if (!questionnaire.is_published) return false;
  if (questionnaire.response_viewable_by === "anyone") return true;
  if (questionnaire.is_administrated_by_me) return true;
  if (
    questionnaire.response_viewable_by === "respondents" &&
    questionnaire.has_my_response
  ) return true;
  return false;
};

export const canRespond = (
  questionnaire: Pick<
    GatewayQuestionnaireSummary,
    | "is_published"
    | "is_duplicate_answer_allowed"
    | "response_due_date_time"
    | "has_my_response"
  >,
) => {
  if (!questionnaire.is_published) return false;
  if (checkIsDueOver(questionnaire)) return false;
  if (questionnaire.is_duplicate_answer_allowed) return true;
  if (questionnaire.has_my_response) return false;
  return true;
};
