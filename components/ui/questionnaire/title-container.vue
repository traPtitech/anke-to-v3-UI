<script setup lang="ts">
import MarkdownBlock from '~/components/ui/markdown/markdown-block.vue';
import type { GatewayQuestionnaire } from '~/models/questionnaire';
import QuestionnaireContainer from './container.vue';

const props = defineProps<{
  questionnaire: GatewayQuestionnaire;
}>();
</script>

<template>
  <QuestionnaireContainer>
    <h1>{{ props.questionnaire.title }}</h1>
    <MarkdownBlock :content="props.questionnaire.description" />
  </QuestionnaireContainer>
</template>
