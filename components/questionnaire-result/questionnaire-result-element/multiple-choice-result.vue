<script lang="ts" setup>
import type { QuestionResultMultipleChoice } from '../composables/use-questionnaire-result';

const props = defineProps<{
  result: QuestionResultMultipleChoice;
  isAnonymous: boolean;
}>();

const aggregatedResponses = computed(() => {
  const responses = props.result.responses.map((res) => res.answer);
  const aggregated: Map<number, number> = new Map();
  responses.forEach((res) => {
    res.forEach((r) => {
      if (!aggregated.has(r)) {
        aggregated.set(r, 1);
        return;
      }

      aggregated.set(r, aggregated.get(r)! + 1);
    });
  });

  const aggregatedResponses = [...aggregated.keys()].map((key) => ({
    answer: props.result.options[key],
    count: aggregated.get(key)!,
    rate: `${((aggregated.get(key)! / responses.length) * 100).toFixed(1)}%`,
    respondents: props.isAnonymous
      ? undefined
      : props.result.responses
          .filter((res) => res.answer.includes(key))
          .map((res) => `@${res.respondent}`)
          .join(' '),
  }));

  return aggregatedResponses;
});
</script>

<template>
  <DataTable :value="aggregatedResponses" sort-field="count" :sort-order="-1">
    <Column field="answer" header="回答" sortable />
    <Column field="count" header="回答数" sortable />
    <Column field="rate" header="回答率" sortable />
    <Column
      v-if="!props.isAnonymous"
      field="respondents"
      header="回答者"
      sortable
    />
  </DataTable>
</template>
