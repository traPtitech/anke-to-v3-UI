<script lang="ts" setup>
import type {
  QuestionBase,
  ResultInfoByType,
} from '~/components/questionnaire-result/type';

defineProps<{
  resultInfo: ResultInfoByType<'TextLong', boolean> & QuestionBase;
}>();
</script>

<template>
  <div class="text-long-result-container">
    <div
      v-for="(_, i) in resultInfo.responses"
      :key="i"
      class="text-long-result-element"
    >
      <div v-if="!resultInfo.isAnonymous" class="text-long-result-element-user">
        @{{ resultInfo.responses[i].user }}
      </div>
      <div>
        {{ resultInfo.responses[i].answer }}
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
