<script lang="ts" setup>
const product = ref([
  {
    questionnaire_id: 1,
    submitted_at: '2023-12-13-00:00:00',
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
