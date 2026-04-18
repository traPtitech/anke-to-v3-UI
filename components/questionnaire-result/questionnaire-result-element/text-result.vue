<script lang="ts" setup>
import type { QuestionResultText } from '~/components/questionnaire-result/composables/use-questionnaire-result';
import UserChip from '~/components/ui/user-chip.vue';

const props = defineProps<{
  result: QuestionResultText;
  isAnonymous: boolean;
  questionnaireId: number;
}>();

const toResponsePath = (responseId: number) =>
  `/questionnaires/${props.questionnaireId}/result/${responseId}`;
</script>

<template>
  <div class="text-result-container">
    <div
      v-for="response in props.result.responses"
      :key="response.response_id"
      class="text-result-element"
      :class="{ 'text-result-element-with-user': !props.isAnonymous }"
    >
      <div class="text-result-element-answer">
        {{ response.answer }}
      </div>
      <div v-if="!props.isAnonymous" class="text-result-element-user">
        <NuxtLink
          class="clickable-user-chip-link"
          :to="toResponsePath(response.response_id)"
        >
          <UserChip :username="response.respondent" />
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.text-result-container {
  display: flex;
  flex-direction: column;
  gap: 8px;
  max-height: 500px;
  overflow-y: auto;
  padding-right: 8px;
}

.text-result-element {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 12px;
  background-color: var(--p-surface-50);
  border-left: 3px solid var(--p-primary-color);
  border-radius: var(--p-border-radius-sm);
}

.text-result-element-with-user {
  flex-direction: row;
  align-items: center;
  gap: 12px;
}

.text-result-element-answer {
  flex: 1;
  min-width: 0;
  white-space: pre-wrap;
}

.text-result-element-user {
  margin-left: auto;
  flex-shrink: 0;
}

.text-result-element-user :deep(.ui-chip) {
  background-color: var(--p-surface-200);
}
</style>
