import type { components } from "~/composables/type-fetch/anke-to/openapi";

export type QuestionnaireResponses = components["schemas"]["Responses"];
export type QuestionnaireDetail = components["schemas"]["QuestionnaireDetail"];

export type QuestionType =
  | "Text"
  | "TextLong"
  | "Number"
  | "SingleChoice"
  | "MultipleChoice"
  | "Scale";

export type AnswerTypeByQuestionType<T extends QuestionType> = {
  Text: string;
  TextLong: string;
  Number: number;
  SingleChoice: number;
  MultipleChoice: number[];
  Scale: number;
}[T];

export type QuestionnaireInfoResponses<T, IsAnonymous extends boolean> = {
  isAnonymous: IsAnonymous;
  responses: ({
    answer: T;
  } & (IsAnonymous extends true ? {} : { user: string }))[];
};

export type ResultInfoByType<
  Type extends QuestionType,
  IsAnonymous extends boolean,
> =
  & components["schemas"][`QuestionSettings${Type}`]
  & (IsAnonymous extends true
    ? QuestionnaireInfoResponses<AnswerTypeByQuestionType<Type>, true>
    : QuestionnaireInfoResponses<AnswerTypeByQuestionType<Type>, false>);

export type QuestionBase = components["schemas"]["QuestionBase"];

export type ResultInfo<IsAnonymous extends boolean> =
  & QuestionBase
  & ResultInfoByType<QuestionType, IsAnonymous>;
