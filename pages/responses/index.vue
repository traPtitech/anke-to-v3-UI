<script lang="ts" setup>
import ResponseList from '~/components/ui/response-list/response-list.vue';
import { useGetMyResponses } from '~/composables/type-fetch/anke-to/client';

const { data, error } = await useGetMyResponses();
</script>

<template>
  <div>
    <div v-if="error" class="error-message">
      {{ error.message }}
    </div>
    <div v-else-if="!data">
      <p>Loading...</p>
    </div>
    <ResponseList v-else :responses="data" />
  </div>
</template>
