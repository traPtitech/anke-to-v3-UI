<script lang="ts" setup>
import {
  useGetQuestionnaire,
  useGetResponse,
} from '~/composables/type-fetch/anke-to/client';

const responseId = useRouteResponseId();
const { data: response, error: responseError } =
  await useGetResponse(responseId);
const { data: questionnaire, error: questionnaireError } = response.value
  ?.questionnaire_id
  ? await useGetQuestionnaire(response.value?.questionnaire_id)
  : { data: null, error: null };
</script>

<template>
  <div v-if="responseError || questionnaireError">
    <p>
      アンケートの取得に失敗しました:
      {{ responseError?.message || questionnaireError?.message }}
    </p>
  </div>
  <div v-else-if="!questionnaire || !response">
    <p>アンケートを読み込み中...</p>
  </div>
  <EditResponseForm
    v-else
    :questionnaire="questionnaire"
    :response="response"
  />
</template>
