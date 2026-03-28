<script lang="ts" setup>
import { useAsyncData } from 'nuxt/app';
import QuestionnaireList from '~/components/ui/questionnaire-list/questionnaire-list.vue';
import { fetchQuestionnaires } from '~/composables/type-fetch/anke-to/client';

const { data, error, pending } = useAsyncData(
  'administrates',
  async () => await fetchQuestionnaires({ onlyAdministratedByMe: true }),
);
</script>

<template>
  <div>
    <div v-if="error" class="error-message">
      {{ error.message }}
    </div>
    <div v-else-if="pending && !data">
      <p>Loading...</p>
    </div>
    <QuestionnaireList
      v-else
      :questionnaires="data && data.questionnaires ? data.questionnaires : []"
    />
  </div>
</template>
