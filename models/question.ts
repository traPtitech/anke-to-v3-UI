import type { components } from "~/composables/type-fetch/anke-to/openapi";

export type GatewayQuestionType =
  components["schemas"]["QuestionSettingsByType"]["question_type"];

export type QuestionBase = components["schemas"]["QuestionBase"] & {
  question_id?: number;
};

export type GatewayQuestionText =
  & QuestionBase
  & components["schemas"]["QuestionSettingsText"];
export type GatewayQuestionTextLong =
  & QuestionBase
  & components["schemas"]["QuestionSettingsTextLong"];
export type GatewayQuestionNumber =
  & QuestionBase
  & components["schemas"]["QuestionSettingsNumber"];
export type GatewayQuestionSingleChoice =
  & QuestionBase
  & components["schemas"]["QuestionSettingsSingleChoice"];
export type GatewayQuestionMultipleChoice =
  & QuestionBase
  & components["schemas"]["QuestionSettingsMultipleChoice"];
export type GatewayQuestionScale =
  & QuestionBase
  & components["schemas"]["QuestionSettingsScale"];

export type GatewayQuestion =
  | GatewayQuestionText
  | GatewayQuestionTextLong
  | GatewayQuestionNumber
  | GatewayQuestionSingleChoice
  | GatewayQuestionMultipleChoice
  | GatewayQuestionScale;
