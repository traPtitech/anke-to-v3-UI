import type { QuestionElement } from "~/components/ui/question-element/composables";
import type { GatewayQuestionnaire } from "~/models/questionnaire";
import type { GatewayResponse } from "~/models/response";

export const useResponseBodies = (
  questionnaire: GatewayQuestionnaire,
  response: GatewayResponse,
) => {
  const bodies = questionnaire.questions.map((q) => {
    const body = response.body.find((b) => b.question_id === q.question_id);
    return {
      ...q,
      answer: body?.answer,
    } as QuestionElement;
  });

  return { bodies };
};
