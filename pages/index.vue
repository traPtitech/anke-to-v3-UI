<script lang="ts" setup>
import { useGetQuestionnaires } from '~/composables/type-fetch/anke-to/client';

const { data, error } = await useGetQuestionnaires();
</script>

<template>
  <div>
    <div v-if="error" class="error-message">
      {{ error.message }}
    </div>
    <div v-else-if="!data">
      <p>Loading...</p>
    </div>
    <LandingPage
      v-else
      :questionnaires="data.questionnaires"
      :questionnaires-draft="data.questionnaires"
      :questionnaires-has-draft="data.questionnaires"
      :questionnaires-targeting-me="data.questionnaires"
      :questionnaires-administered-by-me="data.questionnaires"
      :questionnaires-responded-by-me="data.questionnaires"
    />
  </div>
</template>

<style lang="scss" scoped></style>
