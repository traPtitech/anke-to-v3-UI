<script lang="ts" setup>
import type { QuestionResultSingleChoice } from '../composables/use-questionnaire-result';

const props = defineProps<{
  result: QuestionResultSingleChoice;
  isAnonymous: boolean;
}>();

const aggregatedResponses = computed(() => {
  const responses = props.result.responses.map((res) => res.answer);
  const aggregated: Map<string, number> = new Map();
  responses.forEach((res) => {
    if (!aggregated.has(res)) {
      aggregated.set(res, 1);
      return;
    }

    aggregated.set(res, aggregated.get(res)! + 1);
  });

  const aggregatedResponses = [...aggregated.keys()].map((res) => ({
    value: res,
    count: aggregated.get(res)!,
    rate: `${((aggregated.get(res)! / responses.length) * 100).toFixed(1)}%`,
    respondents: props.isAnonymous
      ? undefined
      : props.result.responses
          .filter((r) => r.answer === res)
          .map((r) => `@${r.respondent}`)
          .join(' '),
  }));

  return aggregatedResponses;
});
</script>

<template>
  <DataTable :value="aggregatedResponses" sort-field="count" :sort-order="-1">
    <Column field="value" header="回答" sortable />
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

<style lang="scss" scoped></style>
