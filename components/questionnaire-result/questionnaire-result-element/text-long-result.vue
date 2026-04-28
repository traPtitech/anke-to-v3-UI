<script lang="ts" setup>
import type { QuestionResultTextLong } from '~/components/questionnaire-result/composables/use-questionnaire-result';
import MarkdownBlock from '~/components/ui/markdown/markdown-block.vue';
import UserChip from '~/components/ui/user-chip.vue';

const props = defineProps<{
  result: QuestionResultTextLong;
  isAnonymous: boolean;
  questionnaireId: number;
}>();

const toResponsePath = (responseId: number) => `/questionnaires/${props.questionnaireId}/result/${responseId}`;
</script>

<template>
  <div class="text-long-result-container">
    <div v-for="response in props.result.responses" :key="response.response_id" class="text-long-result-element">
      <div v-if="!props.isAnonymous" class="text-long-result-element-user">
        <NuxtLink class="clickable-user-chip-link" :to="toResponsePath(response.response_id)">
          <UserChip :username="response.respondent" />
        </NuxtLink>
      </div>
      <MarkdownBlock :content="response.answer" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.text-long-result-container {
  display: flex;
  flex-direction: column;
  gap: 8px;
  max-height: 500px;
  overflow-y: auto;
  padding-right: 8px;
}

.text-long-result-element {
  display: flex;
  flex-direction: column;
  padding: 12px;
  background-color: var(--p-surface-50);
  border-left: 3px solid var(--p-primary-color);
  border-radius: var(--p-border-radius-sm);
}

.text-long-result-element-user {
  width: fit-content;
}

.text-long-result-element-user :deep(.ui-chip) {
  background-color: var(--p-surface-200);
}
</style>
