<script lang="ts" setup>
import {
  useGetQuestionnaire,
  useGetResponses,
} from '~/composables/type-fetch/anke-to/client';

const questionnaireId = useRouteQuestionnaireId();
const { data: questionnaire, error: questionnaireError } =
  await useGetQuestionnaire(questionnaireId);
const { data: responses, error: responsesError } =
  await useGetResponses(questionnaireId);
</script>

<template>
  <div v-if="questionnaireError || responsesError">
    <p>
      アンケートの取得に失敗しました:
      {{ questionnaireError?.message || responsesError?.message }}
    </p>
  </div>
  <div v-else-if="!questionnaire || !responses">
    <p>アンケートを読み込み中...</p>
  </div>
  <QuestionnaireResult
    v-else
    :questionnaire="questionnaire"
    :responses="responses"
  />
</template>

<style lang="scss" scoped></style>
