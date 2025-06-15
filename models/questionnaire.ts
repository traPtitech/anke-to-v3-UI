import type { components } from "~/composables/type-fetch/anke-to/openapi";

export type GatewayQuestionnaire = components["schemas"]["QuestionnaireDetail"];

export type GatewayResponseShareType = components["schemas"]["ResShareType"];

export const responseViewableByOptionsMap = {
  anyone: "全体",
  respondents: "回答した人のみ",
  admins: "管理者のみ",
} satisfies Record<GatewayResponseShareType, string>;
