import type { GatewayQuestion } from "~/models/question";

export type QuestionElementMode = "view" | "edit";

export type QuestionElementBase = GatewayQuestion & { question_id?: number };
export type QuestionElementText =
  & { question_type: "Text"; answer: string }
  & QuestionElementBase;
export type QuestionElementTextLong =
  & { question_type: "TextLong"; answer: string }
  & QuestionElementBase;
export type QuestionElementNumber = {
  question_type: "Number";
  answer: number | undefined;
} & QuestionElementBase;
export type QuestionElementSingleChoice = {
  question_type: "SingleChoice";
  answer: string | undefined;
} & QuestionElementBase;
export type QuestionElementMultipleChoice = {
  question_type: "MultipleChoice";
  answer: string[];
} & QuestionElementBase;
export type QuestionElementScale = {
  question_type: "Scale";
  answer: number | undefined;
} & QuestionElementBase;
export type QuestionElement =
  | QuestionElementText
  | QuestionElementTextLong
  | QuestionElementNumber
  | QuestionElementSingleChoice
  | QuestionElementMultipleChoice
  | QuestionElementScale;

export const checkQuestionFilled = (
  question: QuestionElement,
): boolean => {
  switch (question.question_type) {
    case "Text":
    case "TextLong":
      return question.answer.trim() !== "";
    case "Number":
    case "SingleChoice":
      return question.answer !== undefined;
    case "MultipleChoice":
      return question.answer.length > 0;
    case "Scale":
      return question.answer !== undefined;
    default: {
      const _: never = question;
      return false;
    }
  }
};

export const checkQuestionValidity = (
  question: QuestionElement,
): boolean => {
  return !question.is_required || checkQuestionFilled(question);
};

export const useQuestionValidity = (question: QuestionElement) => {
  const valid = ref(true);
  watch(
    () => question.answer,
    () => (valid.value = checkQuestionValidity(question)),
  );
  return { valid };
};
