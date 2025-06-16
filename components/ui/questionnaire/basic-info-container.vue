<script setup lang="ts">
import {
  type GatewayQuestionnaire,
  responseViewableByOptionsMap,
} from '~/models/questionnaire';

const props = defineProps<{
  questionnaire: GatewayQuestionnaire;
}>();

const dueDateString = computed(() => {
  if (props.questionnaire.response_due_date_time === undefined) {
    return '期限なし';
  }

  const relativeDue = formatRelativeDate(
    new Date(props.questionnaire.response_due_date_time),
  );
  const absoluteDue = formatDate(
    new Date(props.questionnaire.response_due_date_time),
  );
  return `${relativeDue} (${absoluteDue})`;
});

const responseViewableByString = computed(() => {
  return responseViewableByOptionsMap[props.questionnaire.response_viewable_by];
});

const isAnonymousString = computed(() => {
  return props.questionnaire.is_anonymous ? '匿名' : '匿名ではない';
});

const isDuplicateAnswerAllowedString = computed(() => {
  return props.questionnaire.is_duplicate_answer_allowed
    ? '複数回答可'
    : '1回のみ';
});
</script>

<template>
  <QuestionnaireContainer grid>
    <div>
      <QuestionnaireLabel>回答期限</QuestionnaireLabel>
      <div>{{ dueDateString }}</div>
    </div>
    <div>
      <QuestionnaireLabel>回答の公開範囲</QuestionnaireLabel>
      <div>{{ responseViewableByString }}</div>
    </div>
    <div>
      <QuestionnaireLabel>匿名回答かどうか</QuestionnaireLabel>
      <div>{{ isAnonymousString }}</div>
    </div>
    <div>
      <QuestionnaireLabel>複数回答できるか</QuestionnaireLabel>
      <div>{{ isDuplicateAnswerAllowedString }}</div>
    </div>
  </QuestionnaireContainer>
</template>
