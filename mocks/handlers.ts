/**
 * This file is AUTO GENERATED by [msw-auto-mock](https://github.com/zoubingwu/msw-auto-mock)
 * Feel free to commit/edit it as you need.
 */

/* tslint:disable */
import { faker } from '@faker-js/faker';
import { HttpResponse, http } from 'msw';
import { setupWorker } from 'msw/browser';

faker.seed(1);

const baseURL = 'http://localhost:3000/api';
const MAX_ARRAY_LENGTH = 20;

let i = 0;
const next = () => {
  if (i === Number.MAX_SAFE_INTEGER - 1) {
    i = 0;
  }
  return i++;
};

export const handlers = [
  http.get(`${baseURL}/questionnaires`, () => {
    const resultArray = [
      [getGetQuestionnaires200Response(), { status: 200 }],
      [null, { status: 400 }],
      [null, { status: 500 }],
      [null, { status: 503 }],
    ];

    return HttpResponse.json(...resultArray[next() % resultArray.length]);
  }),
  http.post(`${baseURL}/questionnaires`, () => {
    const resultArray = [
      [getPostQuestionnaire201Response(), { status: 201 }],
      [null, { status: 400 }],
      [null, { status: 500 }],
    ];

    return HttpResponse.json(...resultArray[next() % resultArray.length]);
  }),
  http.get(`${baseURL}/questionnaires/:questionnaireId`, () => {
    const resultArray = [
      [getGetQuestionnaire200Response(), { status: 200 }],
      [null, { status: 400 }],
      [null, { status: 404 }],
      [null, { status: 500 }],
    ];

    return HttpResponse.json(...resultArray[next() % resultArray.length]);
  }),
  http.patch(`${baseURL}/questionnaires/:questionnaireId`, () => {
    const resultArray = [
      [null, { status: 200 }],
      [null, { status: 400 }],
      [null, { status: 500 }],
    ];

    return HttpResponse.json(...resultArray[next() % resultArray.length]);
  }),
  http.delete(`${baseURL}/questionnaires/:questionnaireId`, () => {
    const resultArray = [
      [null, { status: 200 }],
      [null, { status: 400 }],
      [null, { status: 500 }],
    ];

    return HttpResponse.json(...resultArray[next() % resultArray.length]);
  }),
  http.get(`${baseURL}/questionnaires/:questionnaireId/myRemindStatus`, () => {
    const resultArray = [
      [getGetQuestionnaireMyRemindStatus200Response(), { status: 200 }],
      [null, { status: 400 }],
      [null, { status: 404 }],
      [null, { status: 500 }],
    ];

    return HttpResponse.json(...resultArray[next() % resultArray.length]);
  }),
  http.patch(
    `${baseURL}/questionnaires/:questionnaireId/myRemindStatus`,
    () => {
      const resultArray = [
        [null, { status: 200 }],
        [null, { status: 400 }],
        [null, { status: 404 }],
        [null, { status: 500 }],
      ];

      return HttpResponse.json(...resultArray[next() % resultArray.length]);
    },
  ),
  http.get(`${baseURL}/questionnaires/:questionnaireId/responses`, () => {
    const resultArray = [
      [getGetQuestionnaireResponses200Response(), { status: 200 }],
      [null, { status: 400 }],
      [null, { status: 403 }],
      [null, { status: 404 }],
      [null, { status: 500 }],
    ];

    return HttpResponse.json(...resultArray[next() % resultArray.length]);
  }),
  http.post(`${baseURL}/questionnaires/:questionnaireId/responses`, () => {
    const resultArray = [
      [getPostQuestionnaireResponse201Response(), { status: 201 }],
      [null, { status: 400 }],
      [null, { status: 404 }],
      [null, { status: 422 }],
      [null, { status: 500 }],
    ];

    return HttpResponse.json(...resultArray[next() % resultArray.length]);
  }),
  http.get(`${baseURL}/questionnaires/:questionnaireId/result`, () => {
    const resultArray = [
      [getGetQuestionnaireResult200Response(), { status: 200 }],
      [null, { status: 400 }],
      [null, { status: 403 }],
      [null, { status: 404 }],
      [null, { status: 500 }],
    ];

    return HttpResponse.json(...resultArray[next() % resultArray.length]);
  }),
  http.get(`${baseURL}/responses/:responseId`, () => {
    const resultArray = [
      [getGetResponse200Response(), { status: 200 }],
      [null, { status: 400 }],
      [null, { status: 403 }],
      [null, { status: 404 }],
      [null, { status: 500 }],
    ];

    return HttpResponse.json(...resultArray[next() % resultArray.length]);
  }),
  http.patch(`${baseURL}/responses/:responseId`, () => {
    const resultArray = [
      [null, { status: 200 }],
      [null, { status: 400 }],
      [null, { status: 403 }],
      [null, { status: 404 }],
      [null, { status: 405 }],
      [null, { status: 500 }],
    ];

    return HttpResponse.json(...resultArray[next() % resultArray.length]);
  }),
  http.delete(`${baseURL}/responses/:responseId`, () => {
    const resultArray = [
      [null, { status: 200 }],
      [null, { status: 400 }],
      [null, { status: 403 }],
      [null, { status: 404 }],
      [null, { status: 405 }],
      [null, { status: 500 }],
    ];

    return HttpResponse.json(...resultArray[next() % resultArray.length]);
  }),
  http.get(`${baseURL}/responses/myResponses`, () => {
    const resultArray = [
      [getGetMyResponses200Response(), { status: 200 }],
      [null, { status: 500 }],
    ];

    return HttpResponse.json(...resultArray[next() % resultArray.length]);
  }),
];

export function getGetQuestionnaires200Response() {
  return {
    page_max: 1,
    questionnaires: [
      ...new Array(faker.number.int({ min: 1, max: MAX_ARRAY_LENGTH })).keys(),
    ].map((_) => ({
      questionnaire_id: 1,
      title: '第1回集会らん☆ぷろ募集アンケート',
      description:
        '第1回メンバー集会でのらん☆ぷろで発表したい人を募集します らん☆ぷろで発表したい人あつまれー！',
      response_due_date_time: '2019-12-31T15:00:00.000Z',
      response_viewable_by: 'anyone',
      is_anonymous: true,
      is_allowing_multiple_responses: true,
      is_published: true,
      is_targeting_me: true,
      created_at: '2019-12-31T15:00:00.000Z',
      modified_at: '2019-12-31T15:00:00.000Z',
      has_my_draft: faker.datatype.boolean(),
      has_my_response: faker.datatype.boolean(),
      responded_date_time_by_me: faker.date.past(),
      all_responded: true,
    })),
  };
}

export function getPostQuestionnaire201Response() {
  return {
    title: '第1回集会らん☆ぷろ募集アンケート',
    description:
      '第1回メンバー集会でのらん☆ぷろで発表したい人を募集します らん☆ぷろで発表したい人あつまれー！',
    response_due_date_time: '2019-12-31T15:00:00.000Z',
    response_viewable_by: 'anyone',
    is_anonymous: true,
    is_allowing_multiple_responses: true,
    is_published: true,
    targets: {
      users: [
        ...new Array(
          faker.number.int({ min: 1, max: MAX_ARRAY_LENGTH }),
        ).keys(),
      ].map((_) => 'cp20'),
      groups: [
        ...new Array(
          faker.number.int({ min: 1, max: MAX_ARRAY_LENGTH }),
        ).keys(),
      ].map((_) => 1),
    },
    admins: {
      users: [
        ...new Array(
          faker.number.int({ min: 1, max: MAX_ARRAY_LENGTH }),
        ).keys(),
      ].map((_) => 'cp20'),
      groups: [
        ...new Array(
          faker.number.int({ min: 1, max: MAX_ARRAY_LENGTH }),
        ).keys(),
      ].map((_) => 1),
    },
    questionnaire_id: 1,
    created_at: '2019-12-31T15:00:00.000Z',
    modified_at: '2019-12-31T15:00:00.000Z',
    questions: [
      ...new Array(faker.number.int({ min: 1, max: MAX_ARRAY_LENGTH })).keys(),
    ].map((_) => null),
    respondents: null,
  };
}

export function getGetQuestionnaire200Response() {
  return {
    title: '第1回集会らん☆ぷろ募集アンケート',
    description:
      '第1回メンバー集会でのらん☆ぷろで発表したい人を募集します らん☆ぷろで発表したい人あつまれー！',
    response_due_date_time: '2019-12-31T15:00:00.000Z',
    response_viewable_by: 'anyone',
    is_anonymous: true,
    is_allowing_multiple_responses: true,
    is_published: true,
    targets: {
      users: [
        ...new Array(
          faker.number.int({ min: 1, max: MAX_ARRAY_LENGTH }),
        ).keys(),
      ].map((_) => 'cp20'),
      groups: [
        ...new Array(
          faker.number.int({ min: 1, max: MAX_ARRAY_LENGTH }),
        ).keys(),
      ].map((_) => 1),
    },
    admins: {
      users: [
        ...new Array(
          faker.number.int({ min: 1, max: MAX_ARRAY_LENGTH }),
        ).keys(),
      ].map((_) => 'cp20'),
      groups: [
        ...new Array(
          faker.number.int({ min: 1, max: MAX_ARRAY_LENGTH }),
        ).keys(),
      ].map((_) => 1),
    },
    questionnaire_id: 1,
    created_at: '2019-12-31T15:00:00.000Z',
    modified_at: '2019-12-31T15:00:00.000Z',
    questions: [
      ...new Array(faker.number.int({ min: 1, max: MAX_ARRAY_LENGTH })).keys(),
    ].map((_) => null),
    respondents: null,
  };
}

export function getGetQuestionnaireMyRemindStatus200Response() {
  return {
    is_remind_enabled: faker.datatype.boolean(),
  };
}

export function getGetQuestionnaireResponses200Response() {
  return [
    ...new Array(faker.number.int({ min: 1, max: MAX_ARRAY_LENGTH })).keys(),
  ].map((_) => ({
    questionnaire_id: 1,
    response_id: 1,
    respondent: 'cp20',
    submitted_at: '2019-12-31T15:00:00.000Z',
    modified_at: '2019-12-31T15:00:00.000Z',
    is_draft: true,
    body: [
      ...new Array(faker.number.int({ min: 1, max: MAX_ARRAY_LENGTH })).keys(),
    ].map((_) =>
      faker.helpers.arrayElement([
        {
          question_type: faker.helpers.arrayElement(['Text']),
          answer: faker.lorem.slug(1),
        },
        {
          question_type: faker.helpers.arrayElement(['TextLong']),
          answer: faker.lorem.slug(1),
        },
        {
          question_type: faker.helpers.arrayElement(['Number']),
          answer: faker.number.int({ min: undefined, max: undefined }),
        },
        {
          question_type: faker.helpers.arrayElement(['SingleChoice']),
          answer: faker.number.int({ min: undefined, max: undefined }),
        },
        {
          question_type: faker.helpers.arrayElement(['MultipleChoice']),
          answer: [
            ...new Array(
              faker.number.int({ min: 1, max: MAX_ARRAY_LENGTH }),
            ).keys(),
          ].map((_) => faker.number.int({ min: undefined, max: undefined })),
        },
        {
          question_type: faker.helpers.arrayElement(['Scale']),
          answer: faker.number.int({ min: undefined, max: undefined }),
        },
      ]),
    ),
  }));
}

export function getPostQuestionnaireResponse201Response() {
  return {
    questionnaire_id: 1,
    response_id: 1,
    respondent: 'cp20',
    submitted_at: '2019-12-31T15:00:00.000Z',
    modified_at: '2019-12-31T15:00:00.000Z',
    is_draft: true,
    body: [
      ...new Array(faker.number.int({ min: 1, max: MAX_ARRAY_LENGTH })).keys(),
    ].map((_) =>
      faker.helpers.arrayElement([
        {
          question_type: faker.helpers.arrayElement(['Text']),
          answer: faker.lorem.slug(1),
        },
        {
          question_type: faker.helpers.arrayElement(['TextLong']),
          answer: faker.lorem.slug(1),
        },
        {
          question_type: faker.helpers.arrayElement(['Number']),
          answer: faker.number.int({ min: undefined, max: undefined }),
        },
        {
          question_type: faker.helpers.arrayElement(['SingleChoice']),
          answer: faker.number.int({ min: undefined, max: undefined }),
        },
        {
          question_type: faker.helpers.arrayElement(['MultipleChoice']),
          answer: [
            ...new Array(
              faker.number.int({ min: 1, max: MAX_ARRAY_LENGTH }),
            ).keys(),
          ].map((_) => faker.number.int({ min: undefined, max: undefined })),
        },
        {
          question_type: faker.helpers.arrayElement(['Scale']),
          answer: faker.number.int({ min: undefined, max: undefined }),
        },
      ]),
    ),
  };
}

export function getGetQuestionnaireResult200Response() {
  return [
    ...new Array(faker.number.int({ min: 1, max: MAX_ARRAY_LENGTH })).keys(),
  ].map((_) => ({
    questionnaire_id: 1,
    response_id: 1,
    submitted_at: '2019-12-31T15:00:00.000Z',
    modified_at: '2019-12-31T15:00:00.000Z',
    is_draft: true,
    body: [
      ...new Array(faker.number.int({ min: 1, max: MAX_ARRAY_LENGTH })).keys(),
    ].map((_) =>
      faker.helpers.arrayElement([
        {
          question_type: faker.helpers.arrayElement(['Text']),
          answer: faker.lorem.slug(1),
        },
        {
          question_type: faker.helpers.arrayElement(['TextLong']),
          answer: faker.lorem.slug(1),
        },
        {
          question_type: faker.helpers.arrayElement(['Number']),
          answer: faker.number.int({ min: undefined, max: undefined }),
        },
        {
          question_type: faker.helpers.arrayElement(['SingleChoice']),
          answer: faker.number.int({ min: undefined, max: undefined }),
        },
        {
          question_type: faker.helpers.arrayElement(['MultipleChoice']),
          answer: [
            ...new Array(
              faker.number.int({ min: 1, max: MAX_ARRAY_LENGTH }),
            ).keys(),
          ].map((_) => faker.number.int({ min: undefined, max: undefined })),
        },
        {
          question_type: faker.helpers.arrayElement(['Scale']),
          answer: faker.number.int({ min: undefined, max: undefined }),
        },
      ]),
    ),
  }));
}

export function getGetResponse200Response() {
  return {
    questionnaire_id: 1,
    response_id: 1,
    respondent: 'cp20',
    submitted_at: '2019-12-31T15:00:00.000Z',
    modified_at: '2019-12-31T15:00:00.000Z',
    is_draft: true,
    body: [
      ...new Array(faker.number.int({ min: 1, max: MAX_ARRAY_LENGTH })).keys(),
    ].map((_) =>
      faker.helpers.arrayElement([
        {
          question_type: faker.helpers.arrayElement(['Text']),
          answer: faker.lorem.slug(1),
        },
        {
          question_type: faker.helpers.arrayElement(['TextLong']),
          answer: faker.lorem.slug(1),
        },
        {
          question_type: faker.helpers.arrayElement(['Number']),
          answer: faker.number.int({ min: undefined, max: undefined }),
        },
        {
          question_type: faker.helpers.arrayElement(['SingleChoice']),
          answer: faker.number.int({ min: undefined, max: undefined }),
        },
        {
          question_type: faker.helpers.arrayElement(['MultipleChoice']),
          answer: [
            ...new Array(
              faker.number.int({ min: 1, max: MAX_ARRAY_LENGTH }),
            ).keys(),
          ].map((_) => faker.number.int({ min: undefined, max: undefined })),
        },
        {
          question_type: faker.helpers.arrayElement(['Scale']),
          answer: faker.number.int({ min: undefined, max: undefined }),
        },
      ]),
    ),
  };
}

export function getGetMyResponses200Response() {
  return [
    ...new Array(faker.number.int({ min: 1, max: MAX_ARRAY_LENGTH })).keys(),
  ].map((_) =>
    [
      ...new Array(faker.number.int({ min: 1, max: MAX_ARRAY_LENGTH })).keys(),
    ].map((_) => ({
      questionnaire_id: 1,
      response_id: 1,
      respondent: 'cp20',
      submitted_at: '2019-12-31T15:00:00.000Z',
      modified_at: '2019-12-31T15:00:00.000Z',
      is_draft: true,
      body: [
        ...new Array(
          faker.number.int({ min: 1, max: MAX_ARRAY_LENGTH }),
        ).keys(),
      ].map((_) =>
        faker.helpers.arrayElement([
          {
            question_type: faker.helpers.arrayElement(['Text']),
            answer: faker.lorem.slug(1),
          },
          {
            question_type: faker.helpers.arrayElement(['TextLong']),
            answer: faker.lorem.slug(1),
          },
          {
            question_type: faker.helpers.arrayElement(['Number']),
            answer: faker.number.int({ min: undefined, max: undefined }),
          },
          {
            question_type: faker.helpers.arrayElement(['SingleChoice']),
            answer: faker.number.int({ min: undefined, max: undefined }),
          },
          {
            question_type: faker.helpers.arrayElement(['MultipleChoice']),
            answer: [
              ...new Array(
                faker.number.int({ min: 1, max: MAX_ARRAY_LENGTH }),
              ).keys(),
            ].map((_) => faker.number.int({ min: undefined, max: undefined })),
          },
          {
            question_type: faker.helpers.arrayElement(['Scale']),
            answer: faker.number.int({ min: undefined, max: undefined }),
          },
        ]),
      ),
      questionnaire_info: {
        title: '第1回集会らん☆ぷろ募集アンケート',
        response_due_date_time: '2019-12-31T15:00:00.000Z',
        created_at: '2019-12-31T15:00:00.000Z',
        modified_at: '2019-12-31T15:00:00.000Z',
        is_targeting_me: true,
      },
    })),
  );
}

// This configures a Service Worker with the given request handlers.
export const startWorker = () => {
  const worker = setupWorker(...handlers);
  worker.start();
};
