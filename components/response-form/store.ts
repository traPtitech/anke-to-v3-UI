import {
  checkQuestionFilled,
  checkQuestionValidity,
  type QuestionElement,
} from "~/components/ui/question-element/composables";
import type { PostNewResponseBody } from "~/composables/type-fetch/anke-to/client";
import type { GatewayQuestion } from "~/models/question";
import type { GatewayQuestionnaire } from "~/models/questionnaire";
import type {
  GatewayNewResponseBody,
  GatewayResponse,
} from "~/models/response";

export type ResponseFormState =
  & { body: QuestionElement[] }
  & Pick<GatewayResponse, "questionnaire_id" | "response_id">;

const getDefaultQuestionValue = (
  question: GatewayQuestion,
): QuestionElement => {
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
      return { ...question, answer: existingAnswer.answer } as QuestionElement;
    }
    return getDefaultQuestionValue(question);
  }),
});

export const useResponseFormStore = (initialState: ResponseFormState) => {
  const state = ref<ResponseFormState>(initialState);

  const atLeastOneFilled = computed(() =>
    state.value.body.some((q) => checkQuestionFilled(q))
  );

  const valid = computed(() =>
    state.value.body.every((q) => checkQuestionValidity(q))
  );

  return { state, valid, atLeastOneFilled };
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
      }) as GatewayNewResponseBody
    ),
});
