<script lang="ts" setup>
const product = [
  {
    title: 'アンケート名',
    response_due_date_time: '2023-12-23T00:00:00',
    modified_at: '2023-12-23T00:00:00',
    description:
      'アンケートの説明アンケートの説明アンケートの説明アンケートの説明',
    all_responded: false,
    
  },
  {
    title: 'アンケート名',
    response_due_date_time: '2023-12-23T00:00:00',
    modified_at: '2023-12-23T00:00:00',
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
