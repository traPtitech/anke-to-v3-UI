<script lang="ts" setup>
import { useGetQuestionnaire } from '~/composables/type-fetch/anke-to/client';

const route = useRoute();
const questionnaireID = parseInt(route.params.questionnaireID as string);
const { data, error } = await useGetQuestionnaire(questionnaireID);
</script>

<template>
  <div v-if="error">
    <p>アンケートの取得に失敗しました: {{ error.message }}</p>
  </div>
  <div v-else-if="!data">
    <p>アンケートを読み込み中...</p>
  </div>
  <NewResponseForm v-else :questionnaire="data" />
</template>
