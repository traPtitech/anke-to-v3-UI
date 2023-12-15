<script lang="ts" setup>
import type {
  QuestionnaireDetail,
  QuestionnaireResponses,
  QuestionnaireResult,
} from '~/components/questionnaire-result/type';

const questionnaireDetail: QuestionnaireDetail = {
  questionnaire_id: 1,
  title: 'アンケートタイトル',
  description: 'アンケートの説明',
  is_allowing_multiple_responses: false,
  is_anonymous: false,
  admins: { users: ['cp20'], groups: [] },
  targets: { users: [], groups: [] },
  created_at: '2021-09-01T00:00:00+09:00',
  is_published: true,
  modified_at: '2021-09-01T00:00:00+09:00',
  questions: [
    {
      questionnaire_id: 1,
      title: '質問1',
      description: '質問1の説明',
      question_type: 'Text',
      is_required: true,
    },
    {
      questionnaire_id: 1,
      title: '質問2',
      description: '質問2の説明',
      question_type: 'TextLong',
      is_required: true,
    },
    {
      questionnaire_id: 1,
      title: '質問3',
      description: '質問3の説明',
      question_type: 'Number',
      is_required: true,
    },
    {
      questionnaire_id: 1,
      title: '質問4',
      description: '質問4の説明',
      question_type: 'SingleChoice',
      is_required: true,
      options: ['選択肢1', '選択肢2', '選択肢3'],
    },
    {
      questionnaire_id: 1,
      title: '質問5',
      description: '質問5の説明',
      question_type: 'MultipleChoice',
      is_required: true,
      options: ['選択肢1', '選択肢2', '選択肢3'],
    },
    {
      questionnaire_id: 1,
      title: '質問6',
      description: '質問6の説明',
      question_type: 'Scale',
      is_required: true,
      min_value: 1,
      max_value: 5,
    },
  ],
  respondents: ['cp20'],
  response_due_date_time: '2021-09-01T00:00:00+09:00',
  response_viewable_by: 'anyone',
};
const questionnaireResult: QuestionnaireResult = {
  response_count: 1,
  questionnaire_id: 1,
  body: [
    {
      question_type: 'Text',
      aggregated_answers: [
        { answer: 'こっちは結構短めでもいいかも', answer_count: 1 },
        { answer: 'テスト回答テスト回答テスト回答テスト回答', answer_count: 1 },
      ],
    },
    {
      question_type: 'TextLong',
      aggregated_answers: [
        {
          answer:
            'けっこう長めの回答をする場合を考慮した方がいいんじゃないかな～けっこう長めの回答をする場合を考慮した方がいいんじゃないかな～けっこう長めの回答をする場合を考慮した方がいいんじゃないかな～',
          answer_count: 1,
        },
        {
          answer:
            '改行のテスト\n改行のテスト\n改行のテスト\n改行のテスト\n改行のテスト\n改行のテスト\n改行のテスト\n改行のテスト\n改行のテスト\n改行のテスト\n改行のテスト\n改行のテスト\n改行のテスト',
          answer_count: 1,
        },
      ],
    },
    {
      question_type: 'Number',
      aggregated_answers: [
        { answer: 100, answer_count: 1 },
        { answer: 50, answer_count: 1 },
      ],
    },
    {
      question_type: 'SingleChoice',
      aggregated_answers: [
        { answer: 0, answer_count: 1 },
        { answer: 1, answer_count: 1 },
      ],
    },
    {
      question_type: 'MultipleChoice',
      aggregated_answers: [
        { answer: 0, answer_count: 1 },
        { answer: 1, answer_count: 1 },
        { answer: 2, answer_count: 2 },
      ],
    },
    {
      question_type: 'Scale',
      aggregated_answers: [
        {
          answer: 3,
          answer_count: 2,
        },
      ],
    },
  ],
};

const questionnaireResponses: QuestionnaireResponses = [
  {
    response_id: 1,
    questionnaire_id: 1,
    respondent: 'cp20',
    is_draft: false,
    body: [
      {
        question_type: 'Text',
        answer: 'こっちは結構短めでもいいかも',
      },
      {
        question_type: 'TextLong',
        answer:
          'けっこう長めの回答をする場合を考慮した方がいいんじゃないかな～けっこう長めの回答をする場合を考慮した方がいいんじゃないかな～けっこう長めの回答をする場合を考慮した方がいいんじゃないかな～',
      },
      {
        question_type: 'Number',
        answer: 100,
      },
      {
        question_type: 'SingleChoice',
        answer: 0,
      },
      {
        question_type: 'MultipleChoice',
        answer: [0, 2],
      },
      {
        question_type: 'Scale',
        answer: 3,
      },
    ],
    submitted_at: '2023-12-15T00:00:00+09:00',
    modified_at: '2023-12-15T00:00:00+09:00',
  },
  {
    response_id: 2,
    questionnaire_id: 1,
    respondent: 'cp20',
    is_draft: false,
    body: [
      {
        question_type: 'Text',
        answer: 'テスト回答テスト回答テスト回答テスト回答',
      },
      {
        question_type: 'TextLong',
        answer:
          '改行のテスト\n改行のテスト\n改行のテスト\n改行のテスト\n改行のテスト\n改行のテスト\n改行のテスト\n改行のテスト\n改行のテスト\n改行のテスト\n改行のテスト\n改行のテスト\n改行のテスト',
      },
      {
        question_type: 'Number',
        answer: 50,
      },
      {
        question_type: 'SingleChoice',
        answer: 1,
      },
      {
        question_type: 'MultipleChoice',
        answer: [1, 2],
      },
      {
        question_type: 'Scale',
        answer: 3,
      },
    ],
    submitted_at: '2023-12-15T00:00:00+09:00',
    modified_at: '2023-12-15T00:00:00+09:00',
  },
];
</script>

<template>
  <AnonymousQuestionnaireResult
    v-if="questionnaireDetail.is_anonymous"
    :detail="questionnaireDetail"
    :result="questionnaireResult"
  />
  <QuestionnaireResult
    v-else
    :detail="questionnaireDetail"
    :responses="questionnaireResponses"
  />
</template>

<style lang="scss" scoped></style>
