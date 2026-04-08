<script lang="ts" setup>
import NewQuestionnaireForm from '~/components/questionnaire-form/new-questionnaire-form.vue';
import { usePageSeo } from '~/composables/use-page-seo';

usePageSeo({
  title: 'アンケート作成',
  description: '新しいアンケートを作成します。',
});
</script>

<template>
  <NewQuestionnaireForm />
</template>
