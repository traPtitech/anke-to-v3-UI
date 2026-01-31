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
  questionnaire: GatewayQuestionnaireSummary,
) => {
  const due = questionnaire.response_due_date_time;
  if (due === undefined) return "期限なし";
  const date = new Date(due);
  return formatRelativeDate(date);
};

export const checkIsDueOver = (
  questionnaire: GatewayQuestionnaireSummary,
) => {
  const due = questionnaire.response_due_date_time;
  if (due === undefined) return false;
  const date = new Date(due);
  return date.getTime() < Date.now();
};
