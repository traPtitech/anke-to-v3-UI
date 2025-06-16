import createClient from "openapi-fetch";
import type { paths } from "./openapi";

const client = createClient<paths>({ baseUrl: "/api" });

type GetQuestionnairesOption =
  paths["/questionnaires"]["get"]["parameters"]["query"];
export const useGetQuestionnaires = async (option?: GetQuestionnairesOption) =>
  useAsyncData(
    "/questionnaires",
    async () => {
      const res = await client.GET("/questionnaires", {
        params: { query: option },
      });
      if (res.data === undefined) {
        throw new Error("No data returned from the API");
      }
      return res.data;
    },
  );

export const useGetQuestionnaire = async (id: number) =>
  useAsyncData(
    `/questionnaires/${id}`,
    async () => {
      const res = await client.GET("/questionnaires/{questionnaireID}", {
        params: { path: { questionnaireID: id } },
      });
      if (res.data === undefined) {
        throw new Error("No data returned from the API");
      }
      return res.data;
    },
  );

export type PostQuestionnaireBody =
  paths["/questionnaires"]["post"]["requestBody"]["content"][
    "application/json"
  ];
export const postNewQuestionnaire = async (data: PostQuestionnaireBody) => {
  const res = await client.POST("/questionnaires", { body: data });
  if (res.data === undefined) {
    throw new Error("No data returned from the API");
  }

  await refreshNuxtData("/questionnaires");

  return res.data;
};

export type PatchMyRemindStatusBody =
  paths["/questionnaires/{questionnaireID}/myRemindStatus"]["patch"][
    "requestBody"
  ]["content"]["application/json"];
export const patchMyRemindStatus = async (
  questionnaireID: number,
  body: PatchMyRemindStatusBody,
) => {
  const res = await client.PATCH(
    "/questionnaires/{questionnaireID}/myRemindStatus",
    {
      params: { path: { questionnaireID } },
      body,
    },
  );
  if (res.data === undefined) {
    throw new Error("No data returned from the API");
  }

  await refreshNuxtData(`/questionnaires/${questionnaireID}`);

  return res.response.ok;
};

export const deleteQuestionnaireById = async (questionnaireID: number) => {
  const res = await client.DELETE("/questionnaires/{questionnaireID}", {
    params: { path: { questionnaireID } },
  });
  if (res.data === undefined) {
    throw new Error("No data returned from the API");
  }

  await refreshNuxtData("/questionnaires");
  await refreshNuxtData(`/questionnaires/${questionnaireID}`);
  return res.response.ok;
};

export type PatchQuestionnaireBody =
  paths["/questionnaires/{questionnaireID}"]["patch"]["requestBody"]["content"][
    "application/json"
  ];
export const patchQuestionnaireById = async (
  questionnaireID: number,
  body: PatchQuestionnaireBody,
) => {
  const res = await client.PATCH("/questionnaires/{questionnaireID}", {
    params: { path: { questionnaireID } },
    body,
  });
  if (res.data === undefined) {
    throw new Error("No data returned from the API");
  }

  await refreshNuxtData("/questionnaires");
  await refreshNuxtData(`/questionnaires/${questionnaireID}`);

  return;
};

export const useGetResponses = async (questionnaireID: number) =>
  useAsyncData(
    `/questionnaires/${questionnaireID}/responses`,
    async () => {
      const res = await client.GET(
        "/questionnaires/{questionnaireID}/responses",
        {
          params: { path: { questionnaireID } },
        },
      );
      if (res.data === undefined) {
        throw new Error("No data returned from the API");
      }
      return res.data;
    },
  );

export const useGetResponse = async (responseID: number) =>
  useAsyncData(
    `/responses/${responseID}`,
    async () => {
      const res = await client.GET("/responses/{responseID}", {
        params: { path: { responseID } },
      });
      if (res.data === undefined) {
        throw new Error("No data returned from the API");
      }
      return res.data;
    },
  );

export type PostNewResponseBody =
  paths["/questionnaires/{questionnaireID}/responses"]["post"]["requestBody"][
    "content"
  ]["application/json"];
export const postNewResponse = async (
  questionnaireID: number,
  data: PostNewResponseBody,
) => {
  const res = await client.POST("/questionnaires/{questionnaireID}/responses", {
    params: { path: { questionnaireID } },
    body: data,
  });

  if (res.data === undefined) {
    throw new Error("No data returned from the API");
  }

  await refreshNuxtData(`/questionnaires/${questionnaireID}`);

  return res.data;
};

export type PatchResponseBody =
  paths["/responses/{responseID}"]["patch"]["requestBody"]["content"][
    "application/json"
  ];
export const patchResponse = async (
  responseID: number,
  data: PatchResponseBody,
) => {
  const res = await client.PATCH("/responses/{responseID}", {
    params: { path: { responseID } },
    body: data,
  });

  if (res.data === undefined) {
    throw new Error("No data returned from the API");
  }

  await refreshNuxtData(`/responses/${responseID}`);

  return res.data;
};
