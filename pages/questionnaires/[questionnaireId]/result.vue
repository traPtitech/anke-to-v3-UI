<script lang="ts" setup>
import {
  useGetQuestionnaire,
  useGetResponses,
} from '~/composables/type-fetch/anke-to/client';

const questionnaireId = useRouteQuestionnaireId();
const { data } = await useGetQuestionnaire(questionnaireId);
const { data } = await useGetResponses(questionnaireId);
</script>

<template>
  <QuestionnaireResult
    :questionnaire="questionnaireDetail"
    :responses="questionnaireResponses"
  />
</template>

<style lang="scss" scoped></style>
