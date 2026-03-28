<script lang="ts" setup>
import type { QuestionResultText } from '~/components/questionnaire-result/composables/use-questionnaire-result';

const props = defineProps<{
  result: QuestionResultText;
  isAnonymous: boolean;
}>();
</script>

<template>
  <div class="text-result-container">
    <div
      v-for="(_, i) in props.result.responses"
      :key="i"
      class="text-result-element"
    >
      <div v-if="!props.isAnonymous" class="text-result-element-user">
        @{{ props.result.responses[i].respondent }}
      </div>
      <div>
        {{ props.result.responses[i].answer }}
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.text-result-container {
  display: flex;
  flex-direction: column;
  gap: 12px;
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

.text-result-element-user {
  font-weight: 600;
  color: var(--p-primary-color);
  font-size: 14px;
}
</style>
