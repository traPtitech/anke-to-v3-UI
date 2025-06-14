<script lang="ts" setup>
import { useGetQuestionnaire } from '~/composables/type-fetch/anke-to/client';

const route = useRoute();

const { data, error } = await useGetQuestionnaire(
  parseInt(route.params.questionnaireID as string),
);
</script>

<template>
  <div v-if="error" class="error">
    {{ error.message }}
  </div>
  <div v-else-if="data === null">Loading...</div>
  <QuestionnaireDetail v-else :detail="data" />
</template>
