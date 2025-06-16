<script lang="ts" setup>
import type { QuestionResultNumber } from '../composables/use-questionnaire-result';

const props = defineProps<{
  result: QuestionResultNumber;
  isAnonymous: boolean;
}>();

const data = props.result.responses.map((r) => ({
  answer: r.answer,
  respondent: props.isAnonymous ? undefined : r.respondent,
}));
</script>

<template>
  <DataTable :value="data" sort-field="answer">
    <Column field="answer" header="回答" sortable />
    <Column
      v-if="!props.isAnonymous"
      field="respondent"
      header="回答者"
      sortable
    />
  </DataTable>
</template>
