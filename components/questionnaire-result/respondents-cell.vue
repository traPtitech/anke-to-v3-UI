<script lang="ts" setup>
import UserChip from '~/components/ui/user-chip.vue';
import CopyRespondentsButton from './copy-respondents-button.vue';

const props = defineProps<{
  respondents: { name: string; responseId: number }[];
  answer: string | number;
  questionnaireId: number;
}>();

const toResponsePath = (responseId: number) => `/questionnaires/${props.questionnaireId}/result/${responseId}`;
</script>

<template>
  <div class="respondents-cell">
    <div class="respondents-chip-list">
      <NuxtLink
        v-for="respondent in props.respondents"
        :key="`${respondent.name}-${respondent.responseId}`"
        class="clickable-user-chip-link"
        :to="toResponsePath(respondent.responseId)"
      >
        <UserChip :username="respondent.name" />
      </NuxtLink>
    </div>
    <CopyRespondentsButton
      :respondents="props.respondents.map((r) => r.name)"
      :action-label="`「${props.answer}」の回答者をコピー`"
    />
  </div>
</template>

<style lang="scss" scoped>
.respondents-cell {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 8px;
}

.respondents-chip-list {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  min-width: 0;
}

// 狭い画面では横スクロールしないとボタンに届かないのでチップの上に置く
@media screen and (max-width: 640px) {
  .respondents-cell {
    flex-direction: column-reverse;
  }
}
</style>
