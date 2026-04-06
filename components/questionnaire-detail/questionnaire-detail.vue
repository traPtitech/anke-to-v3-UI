<script lang="ts" setup>
import QuestionnaireBasicInfoContainer from '~/components/ui/questionnaire/basic-info-container.vue';
import QuestionnaireMiscInfoContainer from '~/components/ui/questionnaire/misc-info-container.vue';
import QuestionnaireRespondentsContainer from '~/components/ui/questionnaire/respondents-container.vue';
import QuestionnaireTitleContainer from '~/components/ui/questionnaire/title-container.vue';
import { useMe } from '~/composables/type-fetch/anke-to/client';
import QuestionnaireActions from './questionnaire-actions.vue';
import QuestionnaireAdminActions from './questionnaire-admin-actions.vue';
import QuestionnaireMyResponsesContainer from './questionnaire-my-responses-container.vue';
import type { QuestionnaireDetail } from './type';

const props = defineProps<{ detail: QuestionnaireDetail }>();

const { data: me } = useMe();
const isQuestionnaireAdmin = computed(() =>
  props.detail.admins.includes(me.value?.name ?? ''),
);
</script>

<template>
  <div class="detail-page">
    <div class="detail-title-area">
      <QuestionnaireTitleContainer :questionnaire="detail" />
    </div>

    <div class="detail-columns">
      <div class="detail-main">
        <section class="main-section">
          <QuestionnaireActions :detail="detail" />
        </section>

        <section class="main-section">
          <QuestionnaireMyResponsesContainer :detail="detail" />
        </section>

        <section v-if="isQuestionnaireAdmin" class="main-section">
          <QuestionnaireAdminActions :detail="detail" />
        </section>
      </div>

      <aside class="detail-sidebar">
        <QuestionnaireBasicInfoContainer :questionnaire="detail" />
        <QuestionnaireRespondentsContainer :questionnaire="detail" />
        <QuestionnaireMiscInfoContainer :questionnaire="detail" />
      </aside>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.detail-page {
  --detail-section-radius: 6px;
  width: 100%;
  max-width: 1080px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 24px;
  padding-bottom: 50vh;
  container-type: inline-size;
}

.detail-title-area {
  border: 1px solid var(--p-surface-200);
  background-color: var(--p-surface-0);
  border-radius: var(--detail-section-radius);
  padding: 32px;
}

.detail-title-area h1 {
  margin: 0 0 8px;
  font-size: 24px;
  font-weight: 700;
  line-height: 1.4;
}

.detail-columns {
  display: grid;
  grid-template-columns: 1fr 320px;
  gap: 32px;
  align-items: start;
}

.detail-main {
  display: flex;
  flex-direction: column;
  gap: 28px;
}

.main-section {
  padding: 24px;
  border-radius: var(--detail-section-radius);
  border: 1px solid var(--p-surface-200);
  background-color: var(--p-surface-0);
}

.detail-sidebar {
  display: flex;
  flex-direction: column;
  gap: 28px;
  padding: 20px;
  border: 1px solid var(--p-surface-200);
  border-radius: var(--detail-section-radius);
  background-color: var(--p-surface-0);
  position: sticky;
  top: 24px;
}

@container (max-width: 768px) {
  .detail-columns {
    grid-template-columns: 1fr;
    gap: 20px;
  }

  .detail-sidebar {
    position: static;
  }
}

@container (max-width: 480px) {
  .detail-title-area {
    padding: 20px;
  }

  .detail-title-area h1 {
    font-size: 20px;
  }

  .main-section {
    padding: 16px;
  }

  .detail-sidebar {
    padding: 16px;
  }
}
</style>
