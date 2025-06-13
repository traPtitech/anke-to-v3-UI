import createClient from "openapi-fetch";
import type { paths } from "./openapi";

const client = createClient<paths>({ baseUrl: "/api" });

type GetQuestionnairesOption =
  paths["/questionnaires"]["get"]["parameters"]["query"];
export const useGetQuestionnaires = async (option?: GetQuestionnairesOption) =>
  useAsyncData(
    async () =>
      (await client.GET("/questionnaires", { params: { query: option } })).data,
  );

export const useGetQuestionnaire = async (id: number) =>
  useAsyncData(
    async () =>
      (await client.GET(`/questionnaires/{questionnaireID}`, {
        params: { path: { questionnaireID: id } },
      }))
        .data,
  );

type PostQuestionnaireBody =
  paths["/questionnaires"]["post"]["requestBody"]["content"][
    "application/json"
  ];
export const postNewQuestionnaire = async (data: PostQuestionnaireBody) =>
  (await client.POST("/questionnaires", { body: data })).data;
