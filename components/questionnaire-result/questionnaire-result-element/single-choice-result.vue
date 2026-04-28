<script lang="ts" setup>
import type { QuestionResultSingleChoice } from '../composables/use-questionnaire-result';
import UserChip from '~/components/ui/user-chip.vue';

const props = defineProps<{
  result: QuestionResultSingleChoice;
  isAnonymous: boolean;
  questionnaireId: number;
}>();

const toResponsePath = (responseId: number) => `/questionnaires/${props.questionnaireId}/result/${responseId}`;

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
    countAndRate: `${aggregated.get(res)!}件 (${((aggregated.get(res)! / responses.length) * 100).toFixed(1)}%)`,
    respondents: props.isAnonymous
      ? undefined
      : props.result.responses
          .filter((r) => r.answer === res)
          .map((r) => ({
            name: r.respondent,
            responseId: r.response_id,
          })),
    respondentsText: props.isAnonymous
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
  <DataTable
    :value="aggregatedResponses"
    sort-field="countAndRate"
    :sort-order="-1"
    scrollable
    scrollable-height="500px"
  >
    <Column field="value" header="回答" sortable />
    <Column field="countAndRate" header="回答数・回答率" sortable />
    <Column v-if="!props.isAnonymous" field="respondentsText" header="回答者" sortable>
      <template #body="{ data }">
        <div class="respondents-chip-list">
          <NuxtLink
            v-for="respondent in data.respondents"
            :key="`${respondent.name}-${respondent.responseId}`"
            class="clickable-user-chip-link"
            :to="toResponsePath(respondent.responseId)"
          >
            <UserChip :username="respondent.name" />
          </NuxtLink>
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
