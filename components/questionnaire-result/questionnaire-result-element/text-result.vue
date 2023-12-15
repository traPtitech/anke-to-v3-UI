<script lang="ts" setup>
import type {
  QuestionBase,
  ResultInfoByType,
} from '~/components/questionnaire-result/type';

defineProps<{
  resultInfo: ResultInfoByType<'Text', boolean> & QuestionBase;
}>();
</script>

<template>
  <div class="text-result-container">
    <div
      v-for="(_, i) in resultInfo.responses"
      :key="i"
      class="text-result-element"
    >
      <div v-if="!resultInfo.isAnonymous" class="text-result-element-user">
        @{{ resultInfo.responses[i].user }}
      </div>
      <div>
        {{ resultInfo.responses[i].answer }}
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
