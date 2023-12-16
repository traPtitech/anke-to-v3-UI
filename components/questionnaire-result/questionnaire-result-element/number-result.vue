<script lang="ts" setup>
import type {
  QuestionBase,
  ResultInfoByType,
} from '~/components/questionnaire-result/type';

defineProps<{
  resultInfo: ResultInfoByType<'Number', boolean> & QuestionBase;
}>();
</script>

<template>
  <div class="number-result-container">
    <div v-for="(_, i) in resultInfo.responses" :key="i">
      <div v-if="!resultInfo.isAnonymous" class="number-result-element-user">
        @{{ resultInfo.responses[i].user }}
      </div>
      <div>
        {{ resultInfo.responses[i].answer }}
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.number-result-container {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.number-result-element-user {
  font-weight: bold;
}
</style>
