import { http, HttpResponse } from 'msw';
import type { paths } from '~/composables/type-fetch/anke-to/openapi';
import { questionnairesData, toSummary } from '~/mocks/handlers/questionnaire';
import { myUserId, oneHourBefore } from '~/mocks/handlers/util';
import type { GatewayResponse } from '~/models/response';

const defaultResponse: Omit<GatewayResponse, 'response_id' | 'questionnaire_id'> = {
  is_draft: false,
  is_anonymous: false,
  modified_at: oneHourBefore,
  submitted_at: oneHourBefore,
  respondent: myUserId,
  body: [],
};

const generateBulkResponses = (startResponseId: number, questionnaireId: number) => {
  const questionnaire = questionnairesData.find((q) => q.questionnaire_id === questionnaireId);
  if (questionnaire === undefined) {
    throw new Error(`Questionnaire with ID=${questionnaireId} not found`);
  }

  const responses: GatewayResponse[] = [];
  const startUserId = 200;

  for (let i = 0; i < 200; i++) {
    const userId = `user${startUserId + i}`;
    const responseId = startResponseId + i;

    const body = [];
    for (const question of questionnaire.questions) {
      if (question.question_type === 'Text') {
        body.push({
          question_id: question.question_id,
          question_type: 'Text',
          answer: `ユーザー${userId}の短い回答${i}`,
        });
      } else if (question.question_type === 'TextLong') {
        body.push({
          question_id: question.question_id,
          question_type: 'TextLong',
          answer: `ユーザー${userId}の長い回答です。\n複数行のテキストも含まれています。\nこのデータは${i}番目のユーザーのものです。`,
        });
      } else if (question.question_type === 'Number') {
        body.push({
          question_id: question.question_id,
          question_type: 'Number',
          answer: Math.floor(Math.random() * 100) + 1,
        });
      } else if (question.question_type === 'SingleChoice') {
        body.push({
          question_id: question.question_id,
          question_type: 'SingleChoice',
          answer: question.options[Math.floor(Math.random() * question.options.length)],
        });
      } else if (question.question_type === 'MultipleChoice') {
        body.push({
          question_id: question.question_id,
          question_type: 'MultipleChoice',
          answer: question.options.filter(() => Math.random() > 0.5),
        });
      } else if (question.question_type === 'Scale') {
        body.push({
          question_id: question.question_id,
          question_type: 'Scale',
          answer: (i % 5) + 1,
        });
      } else {
        const _: never = question;
        throw new Error(
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          `Unknown question type: ${(question as any).question_type}`,
        );
      }
    }

    responses.push({
      ...defaultResponse,
      response_id: responseId,
      questionnaire_id: questionnaireId,
      respondent: userId,
      body: body as GatewayResponse['body'],
      is_anonymous: false,
    });
  }

  return responses;
};

const generateAnonymousResponses = (startResponseId: number, questionnaireId: number) => {
  const questionnaire = questionnairesData.find((q) => q.questionnaire_id === questionnaireId);
  if (questionnaire === undefined) {
    throw new Error(`Questionnaire with ID=${questionnaireId} not found`);
  }

  const responses: GatewayResponse[] = [];

  const anonymousUsers = ['anonymous1', 'anonymous2', 'anonymous3', 'anonymous4', 'anonymous5'];

  for (let i = 0; i < anonymousUsers.length; i++) {
    const responseId = startResponseId + i;

    const body = [];
    for (const question of questionnaire.questions) {
      if (question.question_type === 'Text') {
        body.push({
          question_id: question.question_id,
          question_type: 'Text',
          answer: `匿名回答${i}のテキスト`,
        });
      } else if (question.question_type === 'TextLong') {
        body.push({
          question_id: question.question_id,
          question_type: 'TextLong',
          answer: `匿名回答${i}の長いテキスト\n複数行のテキストです。`,
        });
      } else if (question.question_type === 'Number') {
        body.push({
          question_id: question.question_id,
          question_type: 'Number',
          answer: Math.floor(Math.random() * 100) + 1,
        });
      } else if (question.question_type === 'SingleChoice') {
        const choices = ['選択肢1', '選択肢2', '選択肢3'];
        body.push({
          question_id: question.question_id,
          question_type: 'SingleChoice',
          answer: choices[i % 3],
        });
      } else if (question.question_type === 'MultipleChoice') {
        const choices = ['選択肢1', '選択肢2', '選択肢3'];
        body.push({
          question_id: question.question_id,
          question_type: 'MultipleChoice',
          answer: [...new Set([choices[i % 2], choices[(i + 1) % 3]])],
        });
      } else if (question.question_type === 'Scale') {
        body.push({
          question_id: question.question_id,
          question_type: 'Scale',
          answer: (i % 5) + 1,
        });
      } else {
        const _: never = question;
        throw new Error(
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          `Unknown question type: ${(question as any).question_type}`,
        );
      }
    }

    responses.push({
      ...defaultResponse,
      response_id: responseId,
      questionnaire_id: questionnaireId,
      respondent: anonymousUsers[i],
      body: body as GatewayResponse['body'],
      is_anonymous: true,
    });
  }

  return responses;
};

export const responsesData: GatewayResponse[] = [
  {
    ...defaultResponse,
    response_id: 100,
    questionnaire_id: 1,
    respondent: 'user1',
    body: [
      { question_id: 1, question_type: 'Text', answer: '短いテキスト回答1' },
      {
        question_id: 2,
        question_type: 'TextLong',
        answer: '長いテキスト回答1\nこれは複数行のテキストです。\n改行も含まれています。',
      },
      { question_id: 3, question_type: 'Number', answer: 85 },
      { question_id: 4, question_type: 'SingleChoice', answer: '選択肢1' },
      {
        question_id: 5,
        question_type: 'MultipleChoice',
        answer: ['選択肢1', '選択肢3'],
      },
      { question_id: 6, question_type: 'Scale', answer: 4 },
    ],
  },
  {
    ...defaultResponse,
    response_id: 101,
    questionnaire_id: 1,
    respondent: 'user2',
    body: [
      { question_id: 1, question_type: 'Text', answer: '短いテキスト回答2' },
      {
        question_id: 2,
        question_type: 'TextLong',
        answer:
          '長いテキスト回答2、これはすごい長いです、かなり長いです、どれぐらい長いかと言うと、1行にはとても収まり切らないぐらい長いです、本当に長いです、ここまで読んでますか？きっと読み飛ばしてますよね、はぁ、そうですか、ここまで読んでくれないですね。',
      },
      { question_id: 3, question_type: 'Number', answer: 72 },
      { question_id: 4, question_type: 'SingleChoice', answer: '選択肢2' },
      { question_id: 5, question_type: 'MultipleChoice', answer: ['選択肢2'] },
      { question_id: 6, question_type: 'Scale', answer: 3 },
    ],
  },
  {
    ...defaultResponse,
    response_id: 102,
    questionnaire_id: 1,
    respondent: 'user3',
    body: [
      { question_id: 1, question_type: 'Text', answer: '短いテキスト回答3' },
      {
        question_id: 2,
        question_type: 'TextLong',
        answer: '長いテキスト回答3\nユーザー3の回答になります。',
      },
      { question_id: 3, question_type: 'Number', answer: 90 },
      { question_id: 4, question_type: 'SingleChoice', answer: '選択肢3' },
      {
        question_id: 5,
        question_type: 'MultipleChoice',
        answer: ['選択肢1', '選択肢2'],
      },
      { question_id: 6, question_type: 'Scale', answer: 5 },
    ],
  },
  {
    ...defaultResponse,
    response_id: 103,
    questionnaire_id: 1,
    respondent: myUserId,
    body: [
      { question_id: 1, question_type: 'Text', answer: '自分の短い回答' },
      {
        question_id: 2,
        question_type: 'TextLong',
        answer: '自分の長い回答\n複数行になっています。',
      },
      { question_id: 3, question_type: 'Number', answer: 88 },
      { question_id: 4, question_type: 'SingleChoice', answer: '選択肢1' },
      {
        question_id: 5,
        question_type: 'MultipleChoice',
        answer: ['選択肢1', '選択肢2', '選択肢3'],
      },
      { question_id: 6, question_type: 'Scale', answer: 4 },
    ],
  },
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
  ...generateBulkResponses(1000, 2),
  ...generateAnonymousResponses(2000, 13),
];

export const responsesSortFunc: Record<string, (a: GatewayResponse, b: GatewayResponse) => number> = {
  submitted_at: (a, b) => new Date(b.submitted_at).getTime() - new Date(a.submitted_at).getTime(),
  modified_at: (a, b) => new Date(b.modified_at).getTime() - new Date(a.modified_at).getTime(),
  '-submitted_at': (a, b) => new Date(a.submitted_at).getTime() - new Date(b.submitted_at).getTime(),
  '-modified_at': (a, b) => new Date(a.modified_at).getTime() - new Date(b.modified_at).getTime(),
};

type GetResponseResponse = paths['/responses/{responseID}']['get']['responses']['200']['content']['application/json'];

type GetMyResponsesResponse = paths['/responses/myResponses']['get']['responses']['200']['content']['application/json'];

type GetQuestionnaireResponsesResponse =
  paths['/questionnaires/{questionnaireID}/responses']['get']['responses']['200']['content']['application/json'];

type PostQuestionnaireResponseRequest =
  paths['/questionnaires/{questionnaireID}/responses']['post']['requestBody']['content']['application/json'];

const maskAnonymousRespondent = (response: GatewayResponse): GatewayResponse => {
  if (!response.is_anonymous) return response;
  return {
    ...response,
    respondent: '',
  };
};

export const responseHandlers = [
  http.get('/api/responses/myResponses', (req) => {
    const sort = new URL(req.request.url).searchParams.get('sort') ?? 'submitted_at';
    const page = Number(new URL(req.request.url).searchParams.get('page') ?? '1');
    const pageSize = 20;

    const sortedResponses = questionnairesData
      .map((q) => {
        const responses = responsesData.filter((r) => r.questionnaire_id === q.questionnaire_id);

        const myResponses = responses
          .filter((r) => r.respondent === myUserId)
          .toSorted(responsesSortFunc[sort])
          .map(maskAnonymousRespondent);

        return {
          questionnaire_info: toSummary(q),
          responses: myResponses,
        };
      })
      .filter((qr) => qr.responses.length > 0);

    const startIndex = (page - 1) * pageSize;
    const pagedResponses = sortedResponses.slice(startIndex, startIndex + pageSize);
    const totalPage = Math.ceil(sortedResponses.length / pageSize);

    const response: GetMyResponsesResponse = {
      page_max: totalPage,
      response_groups: pagedResponses,
    };

    return HttpResponse.json(response);
  }),

  http.get('/api/responses/:id', (req) => {
    const { id } = req.params;
    const questionnaireResponse = responsesData.find((r) => r.response_id === Number(id));
    if (!questionnaireResponse) {
      return HttpResponse.json({ message: 'Response not found' }, { status: 404 });
    }

    const response: GetResponseResponse = maskAnonymousRespondent(questionnaireResponse);
    return HttpResponse.json(response);
  }),

  http.patch('/api/responses/:id', async (req) => {
    const { id } = req.params;
    const reqBody = (await req.request.json()) as Partial<GatewayResponse>;

    const responseIndex = responsesData.findIndex((r) => r.response_id === Number(id));
    if (responseIndex === -1) {
      return HttpResponse.json({ message: 'Response not found' }, { status: 404 });
    }

    const mergedQuestionIds = [
      ...new Set([
        ...responsesData[responseIndex].body.map((a) => a.question_id),
        ...(reqBody.body?.map((a) => a.question_id) ?? []),
      ]),
    ];
    const mergedResponseBody = mergedQuestionIds.map((question_id) => {
      const newAnswer = reqBody.body?.find((a) => a.question_id === question_id);
      if (newAnswer) return newAnswer;

      const existingAnswer = responsesData[responseIndex].body.find((a) => a.question_id === question_id);
      if (existingAnswer) return existingAnswer;

      throw new Error(`Question ID ${question_id} not found in existing or new body`);
    });

    const updatedResponse = {
      ...responsesData[responseIndex],
      ...reqBody,
      body: mergedResponseBody,
      modified_at: new Date().toISOString(),
    };

    responsesData[responseIndex] = updatedResponse;

    return HttpResponse.json(updatedResponse);
  }),

  http.delete('/api/responses/:id', (req) => {
    const { id } = req.params;

    const responseIndex = responsesData.findIndex((r) => r.response_id === Number(id));
    if (responseIndex === -1) {
      return HttpResponse.json({ message: 'Response not found' }, { status: 404 });
    }

    responsesData.splice(responseIndex, 1);

    return HttpResponse.json({ message: 'Response deleted' });
  }),

  http.get('/api/questionnaires/:id/responses', (req) => {
    const { id } = req.params;
    const sort = new URL(req.request.url).searchParams.get('sort') ?? 'submitted_at';
    const onlyMyResponse = new URL(req.request.url).searchParams.get('onlyMyResponse') === 'true';

    const questionnaire = questionnairesData.find((q) => q.questionnaire_id === Number(id));
    if (!questionnaire) {
      return HttpResponse.json({ message: 'Questionnaire not found' }, { status: 404 });
    }

    const responses = responsesData.filter((r) => r.questionnaire_id === Number(id));

    const filteredResponses = responses
      .filter((r) => {
        if (onlyMyResponse) {
          return r.respondent === myUserId;
        }
        return true;
      })
      .toSorted(responsesSortFunc[sort]);

    const returnedResponses = questionnaire.is_anonymous
      ? filteredResponses.map(maskAnonymousRespondent)
      : filteredResponses;

    const response: GetQuestionnaireResponsesResponse = returnedResponses;

    return HttpResponse.json(response);
  }),

  http.post('/api/questionnaires/:id/responses', async (req) => {
    const { id } = req.params;
    const body = (await req.request.json()) as PostQuestionnaireResponseRequest;

    const questionnaire = questionnairesData.find((q) => q.questionnaire_id === Number(id));
    if (!questionnaire) {
      return HttpResponse.json({ message: 'Questionnaire not found' }, { status: 404 });
    }

    const lastResponseIndex = responsesData.findIndex(
      (r) => r.questionnaire_id === Number(id) && r.respondent === myUserId && !r.is_draft,
    );

    const newResponse: GatewayResponse = {
      response_id: responsesData.length + 1,
      is_anonymous: questionnaire.is_anonymous,
      respondent: myUserId,
      questionnaire_id: Number(id),
      is_draft: body.is_draft,
      body: body.body,
      modified_at: new Date().toISOString(),
      submitted_at: new Date().toISOString(),
    };

    if (!questionnaire.is_duplicate_answer_allowed && lastResponseIndex !== -1) {
      responsesData.splice(lastResponseIndex, 1);
    }

    responsesData.push(newResponse);
    questionnaire.respondents.push(myUserId);

    return HttpResponse.json(newResponse, { status: 201 });
  }),
];
