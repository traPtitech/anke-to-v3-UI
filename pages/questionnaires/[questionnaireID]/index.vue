<script lang="ts" setup>
import type { QuestionnaireDetail } from '~/components/questionnaire-detail/type';

const questionnaireDetail: QuestionnaireDetail = {
  questionnaire_id: 1,
  title: 'アンケートタイトル',
  description: 'アンケートの説明',
  is_allowing_multiple_responses: true,
  is_anonymous: true,
  admins: {
    users: ['cp20'],
    groups: [], // SysAd_Admin
  },
  targets: {
    users: ['24take'],
    groups: ['f86db5ec-dc02-4885-aa0a-732bb229a1b5'], // SysAd
  },
  created_at: '2023-12-16T13:27:00+09:00',
  is_published: true,
  modified_at: '2023-12-16T13:27:00+09:00',
  questions: [
    {
      questionnaire_id: 1,
      title: '質問1',
      description: '質問1の説明',
      question_type: 'Text',
      is_required: true,
      created_at: '2021-09-01T00:00:00+09:00',
      question_id: 1,
    },
    {
      questionnaire_id: 1,
      title: '質問2',
      description: '質問2の説明',
      question_type: 'TextLong',
      is_required: true,
      created_at: '2021-09-01T00:00:00+09:00',
      question_id: 2,
    },
    {
      questionnaire_id: 1,
      title: '質問3',
      description: '質問3の説明',
      question_type: 'Number',
      is_required: true,
      created_at: '2021-09-01T00:00:00+09:00',
      question_id: 3,
    },
    {
      questionnaire_id: 1,
      title: '質問4',
      description: '質問4の説明',
      question_type: 'SingleChoice',
      is_required: true,
      options: ['選択肢1', '選択肢2', '選択肢3'],
      created_at: '2021-09-01T00:00:00+09:00',
      question_id: 4,
    },
    {
      questionnaire_id: 1,
      title: '質問5',
      description: '質問5の説明',
      question_type: 'MultipleChoice',
      is_required: true,
      options: ['選択肢1', '選択肢2', '選択肢3'],
      created_at: '2021-09-01T00:00:00+09:00',
      question_id: 5,
    },
    {
      questionnaire_id: 1,
      title: '質問6',
      description: '質問6の説明',
      question_type: 'Scale',
      is_required: true,
      min_value: 1,
      max_value: 5,
      created_at: '2021-09-01T00:00:00+09:00',
      question_id: 6,
    },
  ],
  respondents: ['cp20'],
  response_due_date_time: '2023-12-17T23:59:00+09:00',
  response_viewable_by: 'anyone',
};
</script>

<template>
  <QuestionnaireDetail :detail="questionnaireDetail" />
</template>

<style></style>
