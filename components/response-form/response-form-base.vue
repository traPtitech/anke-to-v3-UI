<script lang="ts" setup>
import {
  responseViewableByOptionsMap,
  type GatewayQuestionnaire,
} from '~/models/questionnaire';
import type { ResponseFormState } from './store';

const props = defineProps<{
  questionnaire: GatewayQuestionnaire;
}>();

const state = defineModel<ResponseFormState>({ required: true });
</script>

<template>
  <form class="response-form-container">
    <div class="response-form-metadata-container">
      <h1>{{ props.questionnaire.title }}</h1>
      <p>{{ props.questionnaire.description }}</p>
      <div v-if="props.questionnaire.is_anonymous">匿名回答</div>
      <div>
        公開範囲:
        {{
          responseViewableByOptionsMap[props.questionnaire.response_viewable_by]
        }}
      </div>
      <div>
        回答期限:
        {{
          props.questionnaire.response_due_date_time !== undefined
            ? formatDate(new Date(props.questionnaire.response_due_date_time))
            : 'なし'
        }}
      </div>
    </div>
    <div class="question-elements">
      <QuestionElement
        v-for="(_, i) in state.body"
        :key="i"
        v-model="state.body[i]"
        :mode="'edit'"
      />
    </div>
    <div class="form-action-buttons">
      <slot name="buttons" />
    </div>
  </form>
</template>

<style lang="scss" scoped>
.response-form-container {
  display: flex;
  flex-direction: column;
  gap: 16px;
  max-width: 800px;
  margin: 0 auto;
  padding-right: 144px;
  box-sizing: content-box;
  padding-bottom: 50vh;
}

.response-form-metadata-container {
  display: flex;
  flex-direction: column;
  gap: 16px;
  border: 1px solid var(--p-surface-300);
  border-radius: var(--p-border-radius-md);
  padding: 16px;
}

.question-elements {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.form-action-buttons {
  position: fixed;
  top: 32px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  transform: translateX(832px);
}

@media screen and (max-width: 1300px) {
  .form-action-buttons {
    position: static;
    transform: none;
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
  }

  .new-response-form-container {
    padding-right: 0;
  }
}
@media screen and (max-width: $breakpoint-sm) {
  .form-action-buttons {
    flex-direction: column;
  }
}
</style>
