<script lang="ts" setup>
import { useGetQuestionnaire } from '~/composables/type-fetch/anke-to/client';

const questionnaireId = useRouteQuestionnaireId();
const { data, error } = await useGetQuestionnaire(questionnaireId);
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
