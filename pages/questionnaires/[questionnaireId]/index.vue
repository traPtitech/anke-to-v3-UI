<script lang="ts" setup>
import QuestionnaireDetail from '~/components/questionnaire-detail/questionnaire-detail.vue';
import { useGetQuestionnaire } from '~/composables/type-fetch/anke-to/client';

const questionnaireId = useRouteQuestionnaireId();
const { data, error } = useGetQuestionnaire(questionnaireId);
</script>

<template>
  <div v-if="error" class="error">
    {{ error.message }}
  </div>
  <div v-else-if="data === undefined">Loading...</div>
  <QuestionnaireDetail v-else :detail="data" />
</template>
