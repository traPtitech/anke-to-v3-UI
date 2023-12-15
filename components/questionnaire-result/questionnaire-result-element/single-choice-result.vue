<script lang="ts" setup>
import type {
  QuestionBase,
  ResultInfoByType,
} from '~/components/questionnaire-result/type';

const props = defineProps<{
  resultInfo: ResultInfoByType<'SingleChoice', boolean> & QuestionBase;
}>();

const accumulatedResponses = computed(() => {
  const responses = props.resultInfo.responses.map((res) => res.answer);
  const accumulated: Map<number, number> = new Map();
  responses.forEach((res) => {
    if (!accumulated.has(res)) {
      accumulated.set(res, 1);
      return;
    }

    accumulated.set(res, accumulated.get(res)! + 1);
  });

  const accumulatedResponses = [...accumulated.keys()].map((key) => ({
    value: props.resultInfo.options[key],
    count: accumulated.get(key)!,
    rate: `${((accumulated.get(key)! / responses.length) * 100).toFixed(1)}%`,
    respondents: props.resultInfo.isAnonymous
      ? undefined
      : props.resultInfo.responses
          .filter((res) => res.answer === key)
          .map((res) => `@${res.user}`)
          .join(' '),
  }));

  return accumulatedResponses;
});
</script>

<template>
  <DataTable :value="accumulatedResponses" sort-field="count" :sort-order="-1">
    <Column field="value" header="回答" sortable />
    <Column field="count" header="回答数" sortable />
    <Column field="rate" header="回答率" sortable />
    <Column
      v-if="!resultInfo.isAnonymous"
      field="respondents"
      header="回答者"
      sortable
    />
  </DataTable>
</template>

<style lang="scss" scoped></style>
