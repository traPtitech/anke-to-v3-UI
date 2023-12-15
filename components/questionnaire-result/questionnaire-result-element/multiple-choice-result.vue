<script lang="ts" setup>
import type {
  QuestionBase,
  ResultInfoByType,
} from '~/components/questionnaire-result/type';

const props = defineProps<{
  resultInfo: ResultInfoByType<'MultipleChoice', boolean> & QuestionBase;
}>();

const accumulatedResponses = computed(() => {
  const responses = props.resultInfo.responses.map((res) => res.answer);
  const accumulated: Map<number, number> = new Map();
  responses.forEach((res) => {
    res.forEach((r) => {
      if (!accumulated.has(r)) {
        accumulated.set(r, 1);
        return;
      }

      accumulated.set(r, accumulated.get(r)! + 1);
    });
  });

  const accumulatedResponses = [...accumulated.keys()].map((key) => ({
    value: props.resultInfo.options[key],
    count: accumulated.get(key)!,
    rate: `${((accumulated.get(key)! / responses.length) * 100).toFixed(1)}%`,
    respondents: props.resultInfo.isAnonymous
      ? undefined
      : props.resultInfo.responses
          .filter((res) => res.answer.includes(key))
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
