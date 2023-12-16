<script lang="ts" setup>
const customer = ref([
  {
    title:"ああああああああああああああ",
    response_due_date_time:"2021/10/10",
    modified_at:"2021/10/10",
    questionnaire_id:"1",
  },
]);
</script>

<template>
  <div>
    <questionnaire-list :customers="customer" />
  </div>
</template>

<style></style>
