import type { components } from "~/composables/type-fetch/anke-to/openapi";

export type UserSpecifier = components["schemas"]["UsersAndGroups"];

export type QuestionSettingsBase = components["schemas"]["QuestionBase"] & {
  question_id: number;
};

export type QuestionSettingsText =
  components["schemas"]["QuestionSettingsText"];

export type QuestionSettingsTextLong =
  components["schemas"]["QuestionSettingsTextLong"];

export type QuestionSettingsNumber =
  components["schemas"]["QuestionSettingsNumber"];

export type QuestionSettingsSingleChoice =
  components["schemas"]["QuestionSettingsSingleChoice"];

export type QuestionSettingsMultipleChoice =
  components["schemas"]["QuestionSettingsMultipleChoice"];

export type QuestionSettingsScale =
  components["schemas"]["QuestionSettingsScale"];

export type QuestionSettingsByType =
  | QuestionSettingsText
  | QuestionSettingsTextLong
  | QuestionSettingsNumber
  | QuestionSettingsSingleChoice
  | QuestionSettingsMultipleChoice
  | QuestionSettingsScale;

export type QuestionSettings = QuestionSettingsBase & QuestionSettingsByType;

export type NewQuestionnaireFormSettings =
  & Omit<components["schemas"]["NewQuestionnaire"], "questions">
  & {
    questions: QuestionSettings[];
  };
