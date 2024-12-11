<script lang="ts" setup>
import type { QuestionnaireSummary } from '~/components/landing-page/type';

const questionnaires: QuestionnaireSummary[] = [
  {
    questionnaire_id: 1,
    title: '関数型プログラミングについて　アンケート　講習会の参考にします',
    description:
      '春合宿でスキー・スノボをする人は必ず回答してください。用具をレンタルしない人も回答必須です。 スキーorボードセット,ウェアー上下,小物セットの3つをすべて借りる場合、200円引きになります。 設問には個人情報が含まれますが、回答は管理者のみが閲覧できるように設定されており、提供された情報は今年の合宿での用具レンタルのための資料提出にのみ使用されます。',
    response_due_date_time: '2021-10-01T00:00:00.000Z',
    all_responded: false,
    created_at: '2021-09-01T00:00:00.000Z',
    modified_at: '2021-09-01T00:00:00.000Z',
    has_my_draft: false,
    has_my_response: false,
    is_allowing_multiple_responses: false,
    is_anonymous: false,
    is_published: true,
    is_targeting_me: false,
    response_viewable_by: 'anyone',
    responded_date_time_by_me: undefined,
  },
  {
    questionnaire_id: 2,
    title: '関数型プログラミングについて　アンケート　講習会の参考にします',
    description:
      '春合宿でスキー・スノボをする人は必ず回答してください。用具をレンタルしない人も回答必須です。 スキーorボードセット,ウェアー上下,小物セットの3つをすべて借りる場合、200円引きになります。 設問には個人情報が含まれますが、回答は管理者のみが閲覧できるように設定されており、提供された情報は今年の合宿での用具レンタルのための資料提出にのみ使用されます。',
    response_due_date_time: '2024-10-01T00:00:00.000Z',
    all_responded: false,
    created_at: '2021-09-01T00:00:00.000Z',
    modified_at: '2021-09-01T00:00:00.000Z',
    has_my_draft: false,
    has_my_response: false,
    is_allowing_multiple_responses: false,
    is_anonymous: false,
    is_published: true,
    is_targeting_me: false,
    response_viewable_by: 'anyone',
    responded_date_time_by_me: undefined,
  },
];
</script>

<template>
  <LandingPage
    :questionnaires="questionnaires"
    :questionnaires-draft="questionnaires"
    :questionnaires-has-draft="questionnaires"
    :questionnaires-targeting-me="questionnaires"
    :questionnaires-administered-by-me="questionnaires"
    :questionnaires-responded-by-me="questionnaires"
  />
</template>

<style lang="scss" scoped></style>
