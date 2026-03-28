<script lang="ts" setup>
import QuestionnaireList from '~/components/ui/questionnaire-list/questionnaire-list.vue';
import { useGetQuestionnaires } from '~/composables/type-fetch/anke-to/client';

const { data, error } = useGetQuestionnaires();

const administratedQuestionnaires = computed(
  () =>
    data.value?.questionnaires.filter(
      (questionnaire) => questionnaire.is_administrated_by_me,
    ) ?? [],
);
</script>

<template>
  <div>
    <div v-if="error" class="error-message">
      {{ error.message }}
    </div>
    <div v-else-if="!data">
      <p>Loading...</p>
    </div>
    <QuestionnaireList v-else :questionnaires="administratedQuestionnaires" />
  </div>
</template>
