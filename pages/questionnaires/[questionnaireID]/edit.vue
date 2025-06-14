<script setup lang="ts">
const route = useRoute();
const id = parseInt(route.params.questionnaireID as string);
</script>

<template>
  <EditQuestionnaireForm :id="id" />
</template>
