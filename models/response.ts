import type { components } from "~/composables/type-fetch/anke-to/openapi";

export type GatewayResponse = components["schemas"]["Response"];

export type GatewayNewResponse = components["schemas"]["NewResponse"];

export type GatewayNewResponseBody = components["schemas"]["NewResponseBody"];

export type GatewayResponseWithQuestionnaire =
  components["schemas"]["ResponseWithQuestionnaireInfoItem"];

export const formatResponseSubmitDate = (
  response: Pick<GatewayResponse, "submitted_at">,
) => {
  const createdAt = new Date(response.submitted_at);
  return createdAt.toLocaleString();
};
