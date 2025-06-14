<script setup lang="ts">
import { useGetQuestionnaire } from '~/composables/type-fetch/anke-to/client';

const route = useRoute();
const id = parseInt(route.params.questionnaireID as string);
const { data, error } = await useGetQuestionnaire(id);
</script>

<template>
  <div v-if="error">
    <p>Error loading questionnaire: {{ error.message }}</p>
  </div>
  <div v-else-if="!data">
    <p>Loading...</p>
  </div>
  <EditQuestionnaireForm v-else :questionnaire="data" />
</template>
