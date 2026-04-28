import createClient from 'openapi-fetch';
import type { paths } from './openapi';

const client = createClient<paths>({ baseUrl: '/api' });

const hashOption = (option: object | undefined) => {
  if (!option) return '';
  return `${Object.entries(option)
    .toSorted(([keyA], [keyB]) => keyA.localeCompare(keyB))
    .map(([key, value]) => `${key}=${value}`)
    .join('&')}`;
};

export type GetQuestionnairesOption = paths['/questionnaires']['get']['parameters']['query'];

const cachedGetQuestionnairesKeys = new Set<string>();

const refreshGetQuestionnaires = async () => {
  const keys = Array.from(cachedGetQuestionnairesKeys);
  cachedGetQuestionnairesKeys.clear();
  await Promise.all(keys.map((key) => refreshNuxtData(key)));
};

export const useGetQuestionnaires = (option?: GetQuestionnairesOption) => {
  const key = `/questionnaires!${hashOption(option)}`;
  cachedGetQuestionnairesKeys.add(key);
  return useAsyncData(key, () => fetchQuestionnaires(option));
};

export const fetchQuestionnaires = async (option?: GetQuestionnairesOption) => {
  const res = await client.GET('/questionnaires', {
    params: { query: option },
  });
  if (res.data === undefined) {
    throw new Error('No data returned from the API');
  }
  return res.data;
};

export const useGetQuestionnaire = (id: number) => useAsyncData(`/questionnaires/${id}`, () => fetchQuestionnaire(id));

export const fetchQuestionnaire = async (questionnaireID: number) => {
  const res = await client.GET('/questionnaires/{questionnaireID}', {
    params: { path: { questionnaireID } },
  });
  if (res.data === undefined) {
    throw new Error('No data returned from the API');
  }
  return res.data;
};

export const fetchMyRemindStatus = async (questionnaireID: number) => {
  const res = await client.GET('/questionnaires/{questionnaireID}/myRemindStatus', {
    params: { path: { questionnaireID } },
  });
  if (res.data === undefined) {
    throw new Error('No data returned from the API');
  }
  return res.data;
};

export const useGetMyRemindStatus = (questionnaireID: number) =>
  useAsyncData(`/questionnaires/${questionnaireID}/myRemindStatus`, async () => fetchMyRemindStatus(questionnaireID));

export type PostQuestionnaireBody = paths['/questionnaires']['post']['requestBody']['content']['application/json'];
export const postNewQuestionnaire = async (data: PostQuestionnaireBody) => {
  const res = await client.POST('/questionnaires', { body: data });
  if (res.data === undefined) {
    throw new Error('No data returned from the API');
  }

  await refreshGetQuestionnaires();

  return res.data;
};

export type PatchMyRemindStatusBody =
  paths['/questionnaires/{questionnaireID}/myRemindStatus']['patch']['requestBody']['content']['application/json'];
export const patchMyRemindStatus = async (questionnaireID: number, body: PatchMyRemindStatusBody) => {
  const res = await client.PATCH('/questionnaires/{questionnaireID}/myRemindStatus', {
    params: { path: { questionnaireID } },
    body,
  });

  if (!res.response.ok) {
    throw new Error('Failed to patch remind status');
  }

  await refreshNuxtData(`/questionnaires/${questionnaireID}/myRemindStatus`);
};

export const deleteQuestionnaireById = async (questionnaireID: number) => {
  const res = await client.DELETE('/questionnaires/{questionnaireID}', {
    params: { path: { questionnaireID } },
  });
  if (!res.response.ok) {
    throw new Error('Failed to delete questionnaire');
  }

  await refreshGetQuestionnaires();
  await refreshNuxtData(`/questionnaires/${questionnaireID}`);
};

export type PatchQuestionnaireBody =
  paths['/questionnaires/{questionnaireID}']['patch']['requestBody']['content']['application/json'];
export const patchQuestionnaireById = async (questionnaireID: number, body: PatchQuestionnaireBody) => {
  const res = await client.PATCH('/questionnaires/{questionnaireID}', {
    params: { path: { questionnaireID } },
    body,
  });

  if (!res.response.ok) {
    throw new Error('Failed to patch questionnaire');
  }

  await refreshGetQuestionnaires();
  await refreshNuxtData(`/questionnaires/${questionnaireID}`);
};

type GetQuestionnaireResponsesParams =
  paths['/questionnaires/{questionnaireID}/responses']['get']['parameters']['query'];

export const fetchQuestionnaireResponses = async (
  questionnaireID: number,
  params?: GetQuestionnaireResponsesParams,
) => {
  const res = await client.GET('/questionnaires/{questionnaireID}/responses', {
    params: { path: { questionnaireID }, query: params },
  });
  if (res.data === undefined) {
    throw new Error('No data returned from the API');
  }
  return res.data;
};

const cachedGetQuestionnaireResponsesKeys = new Set<string>();

const refreshGetQuestionnaireResponses = async (questionnaireID: number) => {
  const keys = Array.from(cachedGetQuestionnaireResponsesKeys).filter((key) =>
    key.startsWith(`/questionnaires/${questionnaireID}/responses`),
  );
  keys.forEach((key) => cachedGetQuestionnaireResponsesKeys.delete(key));
  await Promise.all(keys.map((key) => refreshNuxtData(key)));
};

export const useGetQuestionnaireResponses = (questionnaireID: number, params?: GetQuestionnaireResponsesParams) => {
  const key = `/questionnaires/${questionnaireID}/responses!${hashOption(params)}`;
  cachedGetQuestionnaireResponsesKeys.add(key);
  return useAsyncData(key, () => fetchQuestionnaireResponses(questionnaireID, params));
};

export const useGetResponse = (responseID: number) =>
  useAsyncData(`/responses/${responseID}`, async () => {
    const res = await client.GET('/responses/{responseID}', {
      params: { path: { responseID } },
    });
    if (res.data === undefined) {
      throw new Error('No data returned from the API');
    }
    return res.data;
  });

export const useGetResponseWithQuestionnaire = (responseID: number) => {
  const { data: response, error: responseError, refresh: refreshResponse } = useGetResponse(responseID);

  const questionnaireID = computed(() => response.value?.questionnaire_id ?? null);

  const {
    data: questionnaire,
    error: questionnaireError,
    refresh: refreshQuestionnaire,
  } = useAsyncData(
    `questionnaires/${questionnaireID.value ?? 'null'}`,
    async () => {
      if (!questionnaireID.value) {
        return null;
      }
      return fetchQuestionnaire(questionnaireID.value);
    },
    { watch: [questionnaireID] },
  );

  const refresh = async () => {
    await Promise.all([refreshResponse(), refreshQuestionnaire()]);
  };

  return {
    response,
    responseError,
    questionnaire,
    questionnaireError,
    refresh,
  };
};

export type PostNewResponseBody =
  paths['/questionnaires/{questionnaireID}/responses']['post']['requestBody']['content']['application/json'];
export const postNewResponse = async (questionnaireID: number, data: PostNewResponseBody) => {
  const res = await client.POST('/questionnaires/{questionnaireID}/responses', {
    params: { path: { questionnaireID } },
    body: data,
  });

  if (res.data === undefined) {
    throw new Error('No data returned from the API');
  }

  await refreshNuxtData(`/questionnaires/${questionnaireID}`);

  return res.data;
};

export type PatchResponseBody = paths['/responses/{responseID}']['patch']['requestBody']['content']['application/json'];
export const patchResponse = async (responseID: number, data: PatchResponseBody) => {
  const res = await client.PATCH('/responses/{responseID}', {
    params: { path: { responseID } },
    body: data,
  });

  if (!res.response.ok) {
    throw new Error('Failed to patch response');
  }

  await refreshNuxtData(`/responses/${responseID}`);
};

export const deleteResponse = async (responseID: number, questionnaireId?: number) => {
  const res = await client.DELETE('/responses/{responseID}', {
    params: { path: { responseID } },
  });

  if (!res.response.ok) {
    throw new Error('Failed to delete response');
  }

  await refreshNuxtData(`/responses/${responseID}`);
  if (questionnaireId !== undefined) {
    await refreshGetQuestionnaireResponses(questionnaireId);
  }
};

export const closeQuestionnaire = async (questionnaireID: number) => {
  const res = await client.POST('/questionnaires/{questionnaireID}/close', {
    params: { path: { questionnaireID } },
  });
  if (!res.response.ok) {
    throw new Error('Failed to close questionnaire');
  }

  await refreshGetQuestionnaires();
  await refreshNuxtData(`/questionnaires/${questionnaireID}`);
};

export const useMe = () =>
  useAsyncData('/me', async () => {
    const res = await client.GET('/traq/users/me');
    if (res.data === undefined) {
      throw new Error('No data returned from the API');
    }
    return res.data;
  });

export const useUsers = () =>
  useAsyncData('/users', async () => {
    const res = await client.GET('/traq/users');
    if (res.data === undefined) {
      throw new Error('No data returned from the API');
    }
    return res.data;
  });

export const useGroups = () =>
  useAsyncData('/groups', async () => {
    const res = await client.GET('/traq/groups');
    if (res.data === undefined) {
      throw new Error('No data returned from the API');
    }
    return res.data;
  });

export const useStamps = () =>
  useAsyncData('/stamps', async () => {
    const res = await client.GET('/traq/stamps');
    if (res.data === undefined) {
      throw new Error('No data returned from the API');
    }
    return res.data;
  });

export const useChannels = () =>
  useAsyncData('/channels', async () => {
    const res = await client.GET('/traq/channels');
    if (res.data === undefined) {
      throw new Error('No data returned from the API');
    }
    return res.data;
  });
