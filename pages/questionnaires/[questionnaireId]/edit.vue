<script lang="ts" setup>
import EditQuestionnaireForm from '~/components/questionnaire-form/edit-questionnaire-form.vue';
import { useGetQuestionnaire } from '~/composables/type-fetch/anke-to/client';

const questionnaireId = useRouteQuestionnaireId();
const { data, error } = await useGetQuestionnaire(questionnaireId);
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
