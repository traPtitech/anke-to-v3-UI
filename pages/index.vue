<script lang="ts" setup>
import { useGetQuestionnaires } from '~/composables/type-fetch/anke-to/client';

const { data: questionnaires } = await useGetQuestionnaires();
const { data: questionnairesDraft } = await useGetQuestionnaires({
  isDraft: true,
});
const { data: questionnairesHasDraft } = await useGetQuestionnaires({
  hasMyDraft: true,
});
const { data: questionnairesTargetingMe } = await useGetQuestionnaires({
  onlyTargetingMe: true,
});
const { data: questionnairesAdministeredByMe } = await useGetQuestionnaires({
  onlyAdministratedByMe: true,
});
const { data: questionnairesRespondedByMe } = await useGetQuestionnaires({
  hasMyResponse: true,
});
</script>

<template>
  <div>
    <div
      v-if="
        !questionnaires ||
        !questionnairesDraft ||
        !questionnairesHasDraft ||
        !questionnairesTargetingMe ||
        !questionnairesAdministeredByMe ||
        !questionnairesRespondedByMe
      "
    >
      <p>Loading...</p>
    </div>
    <LandingPage
      v-else
      :questionnaires="questionnaires?.questionnaires"
      :questionnaires-draft="questionnairesDraft?.questionnaires"
      :questionnaires-has-draft="questionnairesHasDraft?.questionnaires"
      :questionnaires-targeting-me="questionnairesTargetingMe?.questionnaires"
      :questionnaires-administered-by-me="
        questionnairesAdministeredByMe?.questionnaires
      "
      :questionnaires-responded-by-me="
        questionnairesRespondedByMe?.questionnaires
      "
    />
  </div>
</template>

<style lang="scss" scoped></style>
