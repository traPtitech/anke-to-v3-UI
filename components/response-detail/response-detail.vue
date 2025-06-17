<script lang="ts" setup>
import type { GatewayQuestionnaire } from '~/models/questionnaire';
import type { GatewayResponse } from '~/models/response';
import { useResponseBodies } from './composables/use-question-responses';

const props = defineProps<{
  questionnaire: GatewayQuestionnaire;
  response: GatewayResponse;
}>();

const { bodies } = useResponseBodies(props.questionnaire, props.response);
</script>

<template>
  <div class="response-detail-container">
    <div>
      <Button
        class="p-button-icon-only"
        variant="text"
        @click="
          $router.push(`/questionnaires/${questionnaire.questionnaire_id}`)
        "
      >
        <Icon name="mdi:chevron-left" size="24px" />
      </Button>
    </div>
    <QuestionnaireTitleContainer :questionnaire="questionnaire" />
    <div class="question-elements">
      <QuestionElement
        v-for="(body, index) in bodies"
        :key="index"
        :model-value="body"
        :mode="'view'"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.response-detail-container {
  display: flex;
  flex-direction: column;
  gap: 16px;
  max-width: 800px;
  margin: 0 auto;
  padding-right: 144px;
  box-sizing: content-box;
  padding-bottom: 50vh;
}

.question-elements {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
</style>
