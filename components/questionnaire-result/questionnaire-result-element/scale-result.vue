<script lang="ts" setup>
import type { QuestionResultScale } from '../composables/use-questionnaire-result';
import UserChip from '~/components/ui/user-chip.vue';

const props = defineProps<{
  result: QuestionResultScale;
  isAnonymous: boolean;
}>();

const aggregatedResponses = computed(() => {
  const responses = props.result.responses.map((res) => res.answer);
  const aggregated: Map<number, number> = new Map();
  responses.forEach((res) => {
    if (!aggregated.has(res)) {
      aggregated.set(res, 1);
      return;
    }

    aggregated.set(res, aggregated.get(res)! + 1);
  });

  const aggregatedResponses = [...aggregated.keys()].map((key) => ({
    answer: key,
    countAndRate: `${aggregated.get(key)!}件 (${((aggregated.get(key)! / responses.length) * 100).toFixed(1)}%)`,
    respondents: props.isAnonymous
      ? undefined
      : props.result.responses
          .filter((res) => res.answer === key)
          .map((res) => res.respondent),
    respondentsText: props.isAnonymous
      ? undefined
      : props.result.responses
          .filter((res) => res.answer === key)
          .map((res) => `@${res.respondent}`)
          .join(' '),
  }));

  return aggregatedResponses;
});
</script>

<template>
  <DataTable
    :value="aggregatedResponses"
    sort-field="answer"
    :sort-order="1"
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
