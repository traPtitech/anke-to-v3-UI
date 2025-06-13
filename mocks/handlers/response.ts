import { http, HttpResponse } from "msw";
import type { paths } from "~/composables/type-fetch/anke-to/openapi";
import { questionnairesData, toSummary } from "~/mocks/handlers/questionnaire";
import { myUserId, oneHourBefore } from "~/mocks/handlers/util";
import type { GatewayResponse } from "~/models/response";

const defaultResponse: Omit<
  GatewayResponse,
  "response_id" | "questionnaire_id"
> = {
  is_draft: false,
  modified_at: oneHourBefore,
  submitted_at: oneHourBefore,
  respondent: myUserId,
  body: [],
};

export const responsesData: GatewayResponse[] = [
  {
    ...defaultResponse,
    response_id: 1,
    questionnaire_id: 3,
  },
  {
    ...defaultResponse,
    response_id: 2,
    questionnaire_id: 4,
  },
  {
    ...defaultResponse,
    response_id: 3,
    questionnaire_id: 5,
    is_draft: true,
  },
  {
    ...defaultResponse,
    response_id: 4,
    questionnaire_id: 6,
    is_draft: true,
  },
  {
    ...defaultResponse,
    response_id: 5,
    questionnaire_id: 6,
  },
  {
    ...defaultResponse,
    response_id: 6,
    questionnaire_id: 9,
  },
];

export const responsesSortFunc: Record<
  string,
  (
    a: GatewayResponse,
    b: GatewayResponse,
  ) => number
> = {
  "submitted_at": (a, b) =>
    new Date(b.submitted_at).getTime() - new Date(a.submitted_at).getTime(),
  "modified_at": (a, b) =>
    new Date(b.modified_at).getTime() - new Date(a.modified_at).getTime(),
  "-submitted_at": (a, b) =>
    new Date(a.submitted_at).getTime() - new Date(b.submitted_at).getTime(),
  "-modified_at": (a, b) =>
    new Date(a.modified_at).getTime() - new Date(b.modified_at).getTime(),
};

type GetResponseResponse =
  paths["/responses/{responseID}"]["get"]["responses"]["200"]["content"][
    "application/json"
  ];

type GetMyResponsesResponse =
  paths["/responses/myResponses"]["get"]["responses"]["200"]["content"][
    "application/json"
  ];

type GetQuestionnaireResponsesResponse =
  paths["/questionnaires/{questionnaireID}/responses"]["get"]["responses"][
    "200"
  ]["content"]["application/json"];

type PostQuestionnaireResponseRequest =
  paths["/questionnaires/{questionnaireID}/responses"]["post"]["requestBody"][
    "content"
  ]["application/json"];

export const responseHandlers = [
  http.get("/api/responses/:id", (req) => {
    const { id } = req.params;
    const questionnaireResponse = responsesData.find(
      (r) => r.response_id === Number(id),
    );
    if (!questionnaireResponse) {
      return HttpResponse.json(
        { message: "Response not found" },
        { status: 404 },
      );
    }

    const response: GetResponseResponse = questionnaireResponse;
    return HttpResponse.json(response);
  }),

  http.patch("/api/response/:id", (req) => {
    const { id } = req.params;
    const body = req.request.json() as Partial<GatewayResponse>;

    const responseIndex = responsesData.findIndex(
      (r) => r.response_id === Number(id),
    );
    if (responseIndex === -1) {
      return HttpResponse.json(
        { message: "Response not found" },
        { status: 404 },
      );
    }

    const updatedResponse = {
      ...responsesData[responseIndex],
      ...body,
      modified_at: new Date().toISOString(),
    };

    responsesData[responseIndex] = updatedResponse;

    return HttpResponse.json(updatedResponse);
  }),

  http.delete("/api/response/:id", (req) => {
    const { id } = req.params;

    const responseIndex = responsesData.findIndex(
      (r) => r.response_id === Number(id),
    );
    if (responseIndex === -1) {
      return HttpResponse.json(
        { message: "Response not found" },
        { status: 404 },
      );
    }

    responsesData.splice(responseIndex, 1);

    return HttpResponse.json({ message: "Response deleted" });
  }),

  http.get("/api/responses/myResponses", (req) => {
    const sort = new URL(req.request.url).searchParams.get("sort") ??
      "submitted_at";

    const sortedResponses = questionnairesData.map((q) => {
      const responses = responsesData.filter(
        (r) => r.questionnaire_id === q.questionnaire_id,
      );

      return responses
        .filter((r) => r.respondent === myUserId)
        .toSorted(responsesSortFunc[sort])
        .map((r) => ({
          ...r,
          questionnaire_info: toSummary(q),
        }));
    });

    const response: GetMyResponsesResponse = sortedResponses;

    return HttpResponse.json(response);
  }),

  http.get("/api/questionnaires/:id/responses", (req) => {
    const { id } = req.params;
    const sort = new URL(req.request.url).searchParams.get("sort") ??
      "submitted_at";
    const onlyMyResponse =
      new URL(req.request.url).searchParams.get("onlyMyResponse") === "true";

    const questionnaire = questionnairesData.find(
      (q) => q.questionnaire_id === Number(id),
    );
    if (!questionnaire) {
      return HttpResponse.json(
        { message: "Questionnaire not found" },
        { status: 404 },
      );
    }

    const responses = responsesData.filter(
      (r) => r.questionnaire_id === Number(id),
    );

    const filteredResponses = responses.filter((r) => {
      if (onlyMyResponse) {
        return r.respondent === myUserId;
      }
      return true;
    }).toSorted(responsesSortFunc[sort]);

    const response: GetQuestionnaireResponsesResponse = filteredResponses;

    return HttpResponse.json(response);
  }),

  http.post(
    "/api/questionnaires/:id/responses",
    async (req) => {
      const { id } = req.params;
      const body = await req.request
        .json() as PostQuestionnaireResponseRequest;

      const questionnaire = questionnairesData.find(
        (q) => q.questionnaire_id === Number(id),
      );
      if (!questionnaire) {
        return HttpResponse.json(
          { message: "Questionnaire not found" },
          { status: 404 },
        );
      }

      const lastResponseIndex = responsesData.findIndex(
        (r) =>
          r.questionnaire_id === Number(id) &&
          r.respondent === myUserId &&
          !r.is_draft,
      );

      const newResponse: GatewayResponse = {
        response_id: responsesData.length + 1,
        questionnaire_id: Number(id),
        is_draft: body.is_draft,
        body: body.body,
        modified_at: new Date().toISOString(),
        submitted_at: new Date().toISOString(),
      };

      if (questionnaire.is_anonymous) {
        newResponse.is_anonymous = true;
      } else {
        newResponse.respondent = myUserId;
      }

      if (
        !questionnaire.is_duplicate_answer_allowed &&
        lastResponseIndex !== -1
      ) {
        responsesData.splice(lastResponseIndex, 1);
      }

      responsesData.push(newResponse);

      return HttpResponse.json(newResponse, { status: 201 });
    },
  ),
];
