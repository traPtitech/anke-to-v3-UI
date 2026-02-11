<script lang="ts" setup>
import ResponseDetail from '~/components/response-detail/response-detail.vue';
import {
  useGetQuestionnaire,
  useGetResponse,
} from '~/composables/type-fetch/anke-to/client';

const responseId = useRouteResponseId();
const { data: response, error: responseError } = useGetResponse(responseId);
const { data: questionnaire, error: questionnaireError } = response.value
  ?.questionnaire_id
  ? useGetQuestionnaire(response.value?.questionnaire_id)
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
  <ResponseDetail v-else :questionnaire="questionnaire" :response="response" />
</template>
