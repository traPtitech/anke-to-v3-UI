<script lang="ts" setup>
import QuestionnaireList from '~/components/ui/questionnaire-list/questionnaire-list.vue';
import { useGetQuestionnaires } from '~/composables/type-fetch/anke-to/client';
import {
  checkIsDueOver,
  formatResponseDueDateTime,
} from '~/models/questionnaire';

const { data, error } = useGetQuestionnaires();
</script>

<template>
  <div>
    <div v-if="error" class="error-message">
      {{ error.message }}
    </div>
    <div v-else-if="!data">
      <p>Loading...</p>
    </div>
    <QuestionnaireList v-else :questionnaires="data.questionnaires">
      <template #tip="{ questionnaire }">
        <div class="questionnaire-card-tip">
          <Icon name="mdi:alarm" size="20px" />
          <span>
            {{ formatResponseDueDateTime(questionnaire) }}
          </span>
        </div>
      </template>
      <template #action="{ questionnaire }">
        <NuxtLink
          v-if="!checkIsDueOver(questionnaire)"
          class="questionnaire-card-action-link"
          :to="`/questionnaires/${questionnaire.questionnaire_id}/responses/new`"
        >
          <Icon name="mdi:form-select" size="24px" />
          <span>アンケートに回答</span>
        </NuxtLink>
      </template>
    </QuestionnaireList>
  </div>
</template>
