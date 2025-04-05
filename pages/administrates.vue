<script lang="ts" setup>
formatDate(new Date('2023-12-17T00:00:00'));
const product = [
  {
    title: 'アンケート名',
    response_due_date_time: formatDate(new Date("2023-12-23T00:00:00")),
    modified_at: formatDate(new Date("2023-12-23T00:00:00")),
    description:
      'アンケートの説明アンケートの説明アンケートの説明アンケートの説明',
    all_responded: false,
    
  },
  {
    title: 'アンケート名',
    response_due_date_time: formatDate(new Date("2023-12-17T00:00:00")),
    modified_at: formatDate(new Date('2023-12-17T00:00:00')),
    description:
      'アンケートの説明アンケートの説明アンケートの説明アンケートの説明アンケートの説明アンケートの説明アンケートの説明アンケートの説明アンケートの説明アンケートの説明アンケートの説明アンケートの説明アンケートの説明アンケートの説明アンケートの説明アンケートの説明アンケートの説明アンケートの説明アンケートの説明アンケートの説明アンケートの説明アンケートの説明アンケートの説明アンケートの説明アンケートの説明アンケートの説明アンケートの説明アンケートの説明',
    all_responded: true,
  },
  {
    title: 'アンケート名',
    response_due_date_time: formatDate(new Date("2023-12-17T00:00:00")),
    modified_at: formatDate(new Date('2023-12-17T00:00:00')),
    description:
      'アンケートの説明アンケートの説明アンケートの説明アンケートの説明アンケートの説明アンケートの説明アンケートの説明アンケートの説明アンケートの説明アンケートの説明アンケートの説明アンケートの説明アンケートの説明アンケートの説明アンケートの説明アンケートの説明アンケートの説明アンケートの説明アンケートの説明アンケートの説明アンケートの説明アンケートの説明アンケートの説明アンケートの説明アンケートの説明アンケートの説明アンケートの説明アンケートの説明',
    all_responded: true,
  },
  {
    title: 'アンケート名',
    response_due_date_time: formatDate(new Date("2023-12-17T00:00:00")),
    modified_at: formatDate(new Date('2023-12-17T00:00:00')),
    description:
      'アンケートの説明アンケートの説明アンケートの説明アンケートの説明アンケートの説明アンケートの説明アンケートの説明アンケートの説明アンケートの説明アンケートの説明アンケートの説明アンケートの説明アンケートの説明アンケートの説明アンケートの説明アンケートの説明アンケートの説明アンケートの説明アンケートの説明アンケートの説明アンケートの説明アンケートの説明アンケートの説明アンケートの説明アンケートの説明アンケートの説明アンケートの説明アンケートの説明',
    all_responded: true,
  },
];
</script>

<template>
  <div>
    <administrates-list :products="product" />
  </div>
</template>

<style></style>
