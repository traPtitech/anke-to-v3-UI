<script setup lang="ts">
import UserAndGroupList from '~/components/questionnaire-detail/user-and-group-list.vue';
import UserList from '~/components/questionnaire-detail/user-list.vue';
import type { GatewayQuestionnaire } from '~/models/questionnaire';
import QuestionnaireContainer from './container.vue';
import QuestionnaireLabel from './label.vue';

const props = defineProps<{
  questionnaire: GatewayQuestionnaire;
}>();

const nonAnsweredTargets = computed(() =>
  props.questionnaire.targets.filter(
    (user) => !props.questionnaire.respondents.includes(user),
  ),
);
</script>

<template>
  <QuestionnaireContainer grid>
    <div>
      <QuestionnaireLabel>対象者</QuestionnaireLabel>
      <UserAndGroupList
        :specifier="props.questionnaire.target"
        :actual-users="props.questionnaire.targets"
      />
    </div>
    <div class="questionnaire-target-result">
      <div>
        <QuestionnaireLabel>回答した人</QuestionnaireLabel>
        <UserList :users="props.questionnaire.respondents" />
      </div>
      <div>
        <QuestionnaireLabel>まだ回答してない人</QuestionnaireLabel>
        <UserList :users="nonAnsweredTargets" />
      </div>
    </div>
  </QuestionnaireContainer>
</template>

<style scoped lang="scss">
.questionnaire-target-result {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
</style>
