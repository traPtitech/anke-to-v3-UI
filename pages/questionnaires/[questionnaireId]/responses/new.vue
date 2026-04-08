<script lang="ts" setup>
import NewResponseForm from '~/components/response-form/new-response-form.vue';
import DetailLoadingIndicator from '~/components/ui/page-state/detail-loading-indicator.vue';
import { usePageSeo } from '~/composables/use-page-seo';
import { useGetQuestionnaire } from '~/composables/type-fetch/anke-to/client';

const questionnaireId = useRouteQuestionnaireId();
const { data, error } = useGetQuestionnaire(questionnaireId);

usePageSeo({
  title: computed(() =>
    data.value ? `「${data.value.title}」に回答` : '読み込み中...',
  ),
  description: 'アンケートへの新規回答を作成します。',
});
</script>

<template>
  <div v-if="error">
    <p>アンケートの取得に失敗しました: {{ error.message }}</p>
  </div>
  <div v-else-if="!data">
    <DetailLoadingIndicator variant="questionnaire" />
  </div>
  <NewResponseForm v-else :questionnaire="data" />
</template>
