<script setup lang="ts">
import type { GatewayQuestionnaire } from '~/models/questionnaire';
import QuestionnaireContainer from './container.vue';

const props = defineProps<{
  questionnaire: GatewayQuestionnaire;
}>();
</script>

<template>
  <QuestionnaireContainer>
    <h1>{{ props.questionnaire.title }}</h1>
    <div>{{ props.questionnaire.description }}</div>
  </QuestionnaireContainer>
</template>
