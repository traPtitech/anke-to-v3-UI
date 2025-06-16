<script lang="ts" setup>
import { useGetQuestionnaire } from '~/composables/type-fetch/anke-to/client';

const questionnaireId = useRouteQuestionnaireId();
const { data, error } = await useGetQuestionnaire(questionnaireId);
</script>

<template>
  <div v-if="error" class="error">
    {{ error.message }}
  </div>
  <div v-else-if="data === null">Loading...</div>
  <QuestionnaireDetail v-else :detail="data" />
</template>
