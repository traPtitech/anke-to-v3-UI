<script lang="ts" setup>
import { ref } from 'vue';

const product = ref([
  {
    title: 'アンケート1',
    response_due_date_time: '2023-12-13-00:00:00',
    modified_at: '2023-12-14-00:00:00',
    response_id: 29950,
  },
]);
</script>
<template>
  <div>
    <ResponsesList :products="product" />
  </div>
</template>

<style></style>
