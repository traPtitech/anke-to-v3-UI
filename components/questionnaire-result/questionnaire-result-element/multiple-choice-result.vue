<script lang="ts" setup>
import type { QuestionResultMultipleChoice } from '../composables/use-questionnaire-result';
import UserChip from '~/components/ui/user-chip.vue';

const props = defineProps<{
  result: QuestionResultMultipleChoice;
  isAnonymous: boolean;
}>();

const aggregatedResponses = computed(() => {
  const responses = props.result.responses.map((res) => res.answer);
  const aggregated: Map<string, number> = new Map();
  responses.forEach((res) => {
    res.forEach((r) => {
      if (!aggregated.has(r)) {
        aggregated.set(r, 1);
        return;
      }

      aggregated.set(r, aggregated.get(r)! + 1);
    });
  });

  const aggregatedResponses = [...aggregated.keys()].map((res) => ({
    answer: res,
    countAndRate: `${aggregated.get(res)!}件 (${((aggregated.get(res)! / responses.length) * 100).toFixed(1)}%)`,
    respondents: props.isAnonymous
      ? undefined
      : props.result.responses
          .filter((r) => r.answer.includes(res))
          .map((r) => r.respondent),
    respondentsText: props.isAnonymous
      ? undefined
      : props.result.responses
          .filter((r) => r.answer.includes(res))
          .map((r) => `@${r.respondent}`)
          .join(' '),
  }));

  return aggregatedResponses;
});
</script>

<template>
  <DataTable
    :value="aggregatedResponses"
    sort-field="countAndRate"
    :sort-order="-1"
    scrollable
    scrollable-height="500px"
  >
    <Column field="answer" header="回答" sortable />
    <Column field="countAndRate" header="回答数・回答率" sortable />
    <Column
      v-if="!props.isAnonymous"
      field="respondentsText"
      header="回答者"
      sortable
    >
      <template #body="{ data }">
        <div class="respondents-chip-list">
          <UserChip
            v-for="respondent in data.respondents"
            :key="respondent"
            :username="respondent"
          />
        </div>
      </template>
    </Column>
  </DataTable>
</template>

<style lang="scss" scoped>
.respondents-chip-list {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}
</style>
