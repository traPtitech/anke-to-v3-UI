import type { GatewayQuestion } from "~/models/question";
import type { GatewayQuestionnaire } from "~/models/questionnaire";
import type { GatewayResponse } from "~/models/response";

export type QuestionResultBase = GatewayQuestion & { question_id?: number };
export type QuestionResultResponses<AnswerType> = {
  response_id: number;
  answer: AnswerType;
  respondent: string;
}[];
export type QuestionResultText =
  & { question_type: "Text"; responses: QuestionResultResponses<string> }
  & QuestionResultBase;
export type QuestionResultTextLong =
  & { question_type: "TextLong"; responses: QuestionResultResponses<string> }
  & QuestionResultBase;
export type QuestionResultNumber = {
  question_type: "Number";
  responses: QuestionResultResponses<number>;
} & QuestionResultBase;
export type QuestionResultSingleChoice = {
  question_type: "SingleChoice";
  responses: QuestionResultResponses<string>;
} & QuestionResultBase;
export type QuestionResultMultipleChoice = {
  question_type: "MultipleChoice";
  responses: QuestionResultResponses<string[]>;
} & QuestionResultBase;
export type QuestionResultScale = {
  question_type: "Scale";
  responses: QuestionResultResponses<number>;
} & QuestionResultBase;
export type QuestionResult =
  | QuestionResultText
  | QuestionResultTextLong
  | QuestionResultNumber
  | QuestionResultSingleChoice
  | QuestionResultMultipleChoice
  | QuestionResultScale;

const getResultForQuestion = (
  question: GatewayQuestion,
  responses: GatewayResponse[],
): QuestionResult => {
  const questionResponses = responses.map((r) => {
    if (r.is_draft) return undefined;
    const body = r.body.find((b) => b.question_id === question.question_id);
    if (body === undefined) return undefined;
    return {
      response_id: r.response_id,
      answer: body?.answer,
      respondent: r.respondent,
    };
  });
  return {
    ...question,
    responses: questionResponses.filter((r) => r !== undefined),
  } as QuestionResult;
  // ^^^ answer の型が合わないためアサーションする
};

export const useQuestionnaireResult = (
  questionnaire: GatewayQuestionnaire,
  responses: GatewayResponse[],
) => {
  const results = computed(() =>
    questionnaire.questions.map((q) => getResultForQuestion(q, responses))
  );

  return {
    results,
  };
};
