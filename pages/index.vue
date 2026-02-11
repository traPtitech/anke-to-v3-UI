<script lang="ts" setup>
import LandingPage from '~/components/landing-page/landing-page.vue';
import { useGetQuestionnaires } from '~/composables/type-fetch/anke-to/client';

const { data: questionnaires } = useGetQuestionnaires();
const { data: questionnairesDraft } = useGetQuestionnaires({
  isDraft: true,
});
const { data: questionnairesHasDraft } = useGetQuestionnaires({
  hasMyDraft: true,
});
const { data: questionnairesTargetingMe } = useGetQuestionnaires({
  onlyTargetingMe: true,
});
const { data: questionnairesAdministeredByMe } = useGetQuestionnaires({
  onlyAdministratedByMe: true,
});
const { data: questionnairesRespondedByMe } = useGetQuestionnaires({
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
