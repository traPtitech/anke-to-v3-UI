<script lang="ts" setup>
import type { QuestionResultNumber } from '../composables/use-questionnaire-result';
import UserChip from '~/components/ui/user-chip.vue';

const props = defineProps<{
  result: QuestionResultNumber;
  isAnonymous: boolean;
  questionnaireId: number;
}>();

const toResponsePath = (responseId: number) => `/questionnaires/${props.questionnaireId}/result/${responseId}`;

const data = computed(() =>
  props.result.responses.map((res) => ({
    answer: res.answer,
    responseId: props.isAnonymous ? undefined : res.response_id,
    respondent: props.isAnonymous ? undefined : res.respondent,
    respondentText: props.isAnonymous ? undefined : `@${res.respondent}`,
  })),
);
</script>

<template>
  <DataTable :value="data" sort-field="answer" scrollable scrollable-height="500px">
    <Column field="answer" header="回答" sortable />
    <Column v-if="!props.isAnonymous" field="respondentText" header="回答者" sortable>
      <template #body="{ data }">
        <NuxtLink class="clickable-user-chip-link" :to="toResponsePath(data.responseId)">
          <UserChip :username="data.respondent" />
        </NuxtLink>
      </template>
    </Column>
  </DataTable>
</template>
