<script setup lang="ts">
import UserAndGroupList from '~/components/questionnaire-detail/user-and-group-list.vue';
import type { GatewayQuestionnaire } from '~/models/questionnaire';
import QuestionnaireContainer from './container.vue';
import QuestionnaireLabel from './label.vue';

const props = defineProps<{
  questionnaire: GatewayQuestionnaire;
}>();
</script>

<template>
  <QuestionnaireContainer grid>
    <div>
      <QuestionnaireLabel>管理者</QuestionnaireLabel>
      <UserAndGroupList
        :specifier="props.questionnaire.admin"
        :actual-users="props.questionnaire.admins"
      />
    </div>
    <div>
      <QuestionnaireLabel>最終更新日時</QuestionnaireLabel>
      <div>
        {{ formatRelativeDate(new Date(props.questionnaire.modified_at)) }}
        ({{ formatDate(new Date(props.questionnaire.modified_at)) }})
      </div>
    </div>
    <div>
      <QuestionnaireLabel>作成日時</QuestionnaireLabel>
      <div>
        {{ formatRelativeDate(new Date(props.questionnaire.created_at)) }}
        ({{ formatDate(new Date(props.questionnaire.created_at)) }})
      </div>
    </div>
  </QuestionnaireContainer>
</template>
