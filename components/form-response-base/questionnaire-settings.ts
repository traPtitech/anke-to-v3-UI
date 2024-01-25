export type ResponseFormUserSpecifier = {
  users: string[];
  groups: string[];
};

export type ResponseFormQuestionSettingsBase = {
  title: string;
  description: string;
  required: boolean;
};

export type ResponseFormQuestionSettingsText = {
  type: 'Text';
};

export type ResponseFormQuestionSettingsTextLong = {
  type: 'TextLong';
};

export type ResponseFormQuestionSettingsNumber = {
  type: 'Number';
};

export type ResponseFormQuestionSettingsSingleChoice = {
  type: 'SingleChoice';
  options: string[];
};

export type ResponseFormQuestionSettingsMultipleChoice = {
  type: 'MultipleChoice';
  options: string[];
};

export type ResponseFormQuestionSettingsScale = {
  type: 'Scale';
  minValue: number;
  minLabel?: string;
  maxValue: number;
  maxLabel?: string;
};

export type ResponseFormQuestionSettingsByType =
  | ResponseFormQuestionSettingsText
  | ResponseFormQuestionSettingsTextLong
  | ResponseFormQuestionSettingsNumber
  | ResponseFormQuestionSettingsSingleChoice
  | ResponseFormQuestionSettingsMultipleChoice
  | ResponseFormQuestionSettingsScale;

export type ResponseFormQuestionSettings = ResponseFormQuestionSettingsBase &
  ResponseFormQuestionSettingsByType;

export type ResponseFormQuestionnaireFormSettings = {
  title: string;
  description: string;
  responseDueDateTime: string | null;
  responseViewableBy: 'anyone' | 'respondents' | 'admins';
  isAnonymous: boolean;
  isAllowMultiResponse: boolean;
  targets: ResponseFormUserSpecifier;
  admins: ResponseFormUserSpecifier;
  questions: ResponseFormQuestionSettings[];
};

export type ResponseFormQuestionInvalid = {
  isInvalid: boolean;
};
