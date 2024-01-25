export type ResponseSettingsText = {
  type: 'Text';
  text: string;
};

export type ResponseSettingsTextLong = {
  type: 'TextLong';
  textLong: string;
};

export type ResponseSettingsNumber = {
  type: 'Number';
  number: number | null;
};

export type ResponseSettingsSingleChoice = {
  type: 'SingleChoice';
  index: number;
};

export type ResponseSettingsMultipleChoice = {
  type: 'MultipleChoice';
  indexes: number[];
};

export type ResponseSettingsScale = {
  type: 'Scale';
  number: number;
};

export type ResponseSettings =
  | ResponseSettingsText
  | ResponseSettingsTextLong
  | ResponseSettingsNumber
  | ResponseSettingsSingleChoice
  | ResponseSettingsMultipleChoice
  | ResponseSettingsScale;

export type ResponseQuestionType = ResponseSettings['type'];

export type ResponseFormBody = ResponseSettings[];

export const defaultQuestionSettingsByType = {
  Text: { type: 'Text', text: '' },
  TextLong: { type: 'TextLong', textLong: '' },
  Number: { type: 'Number', number: null },
  SingleChoice: { type: 'SingleChoice', index: -1 },
  MultipleChoice: { type: 'MultipleChoice', indexes: [] },
  Scale: { type: 'Scale', number: -1 },
} satisfies Record<ResponseQuestionType, ResponseSettings>;
