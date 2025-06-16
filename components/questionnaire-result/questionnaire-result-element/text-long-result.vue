<script lang="ts" setup>
import type { QuestionResultTextLong } from '~/components/questionnaire-result/composables/use-questionnaire-result';

const props = defineProps<{
  result: QuestionResultTextLong;
  isAnonymous: boolean;
}>();
</script>

<template>
  <div class="text-long-result-container">
    <div
      v-for="(_, i) in props.result.responses"
      :key="i"
      class="text-long-result-element"
    >
      <div v-if="!props.isAnonymous" class="text-long-result-element-user">
        @{{ props.result.responses[i].respondent }}
      </div>
      <div>
        {{ props.result.responses[i].answer }}
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.text-long-result-container {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.text-long-result-element {
  white-space: pre-wrap;
}

.text-long-result-element-user {
  font-weight: bold;
}
</style>
