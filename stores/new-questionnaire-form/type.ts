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
  type: 'text';
};

export type QuestionSettingsTextLong = {
  type: 'text-long';
};

export type QuestionSettingsNumber = {
  type: 'number';
};

export type QuestionSettingsSingleChoice = {
  type: 'single-choice';
  options: { id: string; label: string }[];
};

export type QuestionSettingsMultipleChoice = {
  type: 'multiple-choice';
  options: { id: string; label: string }[];
};

export type QuestionSettingsScale = {
  type: 'scale';
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
  responseDueDateTime?: Date;
  responseViewableBy: 'public' | 'respondents' | 'administrators';
  targets: UserSpecifier;
  administrators: UserSpecifier;
  questions: QuestionSettings[];
};
