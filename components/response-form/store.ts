import type { PostNewResponseBody } from "~/composables/type-fetch/anke-to/client";
import type { GatewayQuestion } from "~/models/question";
import type { GatewayQuestionnaire } from "~/models/questionnaire";
import type { GatewayResponse, GatewayResponseBody } from "~/models/response";

export type ResponseFormState =
  & { body: ResponseBody[] }
  & Pick<GatewayResponse, "questionnaire_id" | "response_id">;

export type ResponseBodyBase = GatewayQuestion & { question_id?: number };
export type ResponseBodyText =
  & { question_type: "Text"; answer: string }
  & ResponseBodyBase;
export type ResponseBodyTextLong =
  & { question_type: "TextLong"; answer: string }
  & ResponseBodyBase;
export type ResponseBodyNumber = {
  question_type: "Number";
  answer: number | undefined;
} & ResponseBodyBase;
export type ResponseBodySingleChoice = {
  question_type: "SingleChoice";
  answer: number | undefined;
} & ResponseBodyBase;
export type ResponseBodyMultipleChoice = {
  question_type: "MultipleChoice";
  answer: number[];
} & ResponseBodyBase;
export type ResponseBodyScale = {
  question_type: "Scale";
  answer: number | undefined;
} & ResponseBodyBase;
export type ResponseBody =
  | ResponseBodyText
  | ResponseBodyTextLong
  | ResponseBodyNumber
  | ResponseBodySingleChoice
  | ResponseBodyMultipleChoice
  | ResponseBodyScale;

const getDefaultQuestionValue = (
  question: GatewayQuestion,
): ResponseBody => {
  switch (question.question_type) {
    case "Text":
      return { ...question, answer: "" };
    case "TextLong":
      return { ...question, answer: "" };
    case "Number":
      return { ...question, answer: undefined };
    case "SingleChoice":
      return { ...question, answer: undefined };
    case "MultipleChoice":
      return { ...question, answer: [] };
    case "Scale":
      return { ...question, answer: undefined };
    default: {
      const _: never = question;
      throw new Error(`Unsupported question: ${question}`);
    }
  }
};

export const getInitialResponseFormState = (
  questionnaire: GatewayQuestionnaire,
): ResponseFormState => ({
  questionnaire_id: questionnaire.questionnaire_id,
  response_id: createId(),
  body: questionnaire.questions.map((question) => {
    return getDefaultQuestionValue(question);
  }),
});

export const getExistingResponseFormState = (
  questionnaire: GatewayQuestionnaire,
  response: GatewayResponse,
): ResponseFormState => ({
  questionnaire_id: questionnaire.questionnaire_id,
  response_id: response.response_id,
  body: questionnaire.questions.map((question) => {
    const existingAnswer = response.body.find(
      (answer) => answer.question_id === question.question_id,
    );
    if (existingAnswer) {
      return { ...question, answer: existingAnswer.answer } as ResponseBody;
    }
    return getDefaultQuestionValue(question);
  }),
});

export const useResponseFormStore = (initialState: ResponseFormState) => {
  const state = ref<ResponseFormState>(initialState);

  const valid = computed(() =>
    state.value.body.every((q) => checkQuestionValidity(q))
  );

  return { state, valid };
};

const checkQuestionFilled = (
  question: ResponseBody,
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
  question: ResponseBody,
): boolean => {
  return !question.is_required || checkQuestionFilled(question);
};

export const useQuestionValidity = (question: ResponseBody) => {
  const valid = ref(true);
  watch(
    () => question.answer,
    () => (valid.value = checkQuestionValidity(question)),
  );
  return { valid };
};

export const convertToBody = (
  state: ResponseFormState,
): Omit<PostNewResponseBody, "is_draft"> => ({
  body: state.body
    .filter((q) => checkQuestionFilled(q))
    .map((q) =>
      ({
        question_id: q.question_id!,
        answer: q.answer,
        question_type: q.question_type,
      }) as GatewayResponseBody
    ),
});
