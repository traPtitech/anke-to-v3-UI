<script lang="ts" setup>
import ResponseList from '~/components/ui/response-list/response-list.vue';
import { usePageSeo } from '~/composables/use-page-seo';
import { useGetMyResponses } from '~/composables/type-fetch/anke-to/client';

const { data, error } = await useGetMyResponses();

usePageSeo({
  title: '自分の回答',
  description: '自分が送信した回答一覧を確認できます。',
});
</script>

<template>
  <div>
    <div v-if="error" class="error-message">
      {{ error.message }}
    </div>
    <div v-else-if="!data">
      <p>Loading...</p>
    </div>
    <ResponseList v-else :responses="data" />
  </div>
</template>
