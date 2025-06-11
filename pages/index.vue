<script lang="ts" setup>
import { useFetchAnkeToApi } from '~/composables/type-fetch/anke-to/use-fetch-anke-to-api';

const { data: baseData } = useFetchAnkeToApi('/questionnaires');
</script>

<template>
  <LandingPage
    v-if="baseData"
    :questionnaires="baseData.questionnaires"
    :questionnaires-draft="baseData.questionnaires"
    :questionnaires-has-draft="baseData.questionnaires"
    :questionnaires-targeting-me="baseData.questionnaires"
    :questionnaires-administered-by-me="baseData.questionnaires"
    :questionnaires-responded-by-me="baseData.questionnaires"
  />
</template>

<style lang="scss" scoped></style>
