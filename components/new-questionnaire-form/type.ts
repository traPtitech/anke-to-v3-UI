export type UserSpecifier = {
  users: string[];
  groups: string[];
};

export type QuestionSettingsBase = {
  id: string;
  title: string;
  description: string;
  required: boolean;
};

export type QuestionSettingsText = {
  type: 'Text';
};

export type QuestionSettingsTextLong = {
  type: 'TextLong';
};

export type QuestionSettingsNumber = {
  type: 'Number';
};

export type QuestionSettingsSingleChoice = {
  type: 'SingleChoice';
  options: { id: string; label: string }[];
};

export type QuestionSettingsMultipleChoice = {
  type: 'MultipleChoice';
  options: { id: string; label: string }[];
};

export type QuestionSettingsScale = {
  type: 'Scale';
  minValue: number;
  minLabel?: string;
  maxValue: number;
  maxLabel?: string;
};

export type QuestionSettingsByType =
  | QuestionSettingsText
  | QuestionSettingsTextLong
  | QuestionSettingsNumber
  | QuestionSettingsSingleChoice
  | QuestionSettingsMultipleChoice
  | QuestionSettingsScale;

export type QuestionSettings = QuestionSettingsBase & QuestionSettingsByType;

export type QuestionnaireFormSettings = {
  title: string;
  description: string;
  responseDueDateTime: string | null;
  responseViewableBy: 'anyone' | 'respondents' | 'admins';
  isAnonymous: boolean;
  isAllowingMultipleResponses: boolean;
  targets: UserSpecifier;
  admins: UserSpecifier;
  questions: QuestionSettings[];
};
