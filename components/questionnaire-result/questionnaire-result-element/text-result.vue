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
  gap: 16px;
}

.text-result-element {
  display: flex;
  flex-direction: column;
}

.text-result-element-user {
  font-weight: bold;
}
</style>
