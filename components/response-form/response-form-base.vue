<script lang="ts" setup>
import MarkdownBlock from '~/components/ui/markdown/markdown-block.vue';
import QuestionElement from '~/components/ui/question-element/question-element.vue';
import {
  responseViewableByOptionsMap,
  type GatewayQuestionnaire,
} from '~/models/questionnaire';
import type { ResponseFormState } from './store';

const props = defineProps<{
  questionnaire: GatewayQuestionnaire;
}>();

const state = defineModel<ResponseFormState>({ required: true });

const dueDateString = computed(() => {
  if (props.questionnaire.response_due_date_time === undefined)
    return '期限なし';
  return formatDate(new Date(props.questionnaire.response_due_date_time));
});
</script>

<template>
  <form class="response-form-container">
    <div class="response-form-nav">
      <Button
        class="p-button-icon-only back-button"
        variant="text"
        @click="
          $router.push(
            `/questionnaires/${props.questionnaire.questionnaire_id}`,
          )
        "
      >
        <Icon name="mdi:chevron-left" size="24px" />
      </Button>
    </div>

    <div class="response-form-title-row">
      <div class="response-form-title-area">
        <div class="response-form-meta-chips">
          <span v-if="props.questionnaire.is_anonymous" class="meta-chip">
            <Icon name="mdi:incognito" size="13px" />
            匿名
          </span>
          <span class="meta-chip">
            <Icon name="mdi:eye-outline" size="13px" />
            {{
              responseViewableByOptionsMap[
                props.questionnaire.response_viewable_by
              ]
            }}公開
          </span>
          <span
            class="meta-chip"
            :class="{
              'meta-chip-deadline':
                props.questionnaire.response_due_date_time !== undefined,
            }"
          >
            <Icon name="mdi:clock-outline" size="13px" />
            {{ dueDateString }}
          </span>
        </div>
        <h1 class="response-form-title">{{ props.questionnaire.title }}</h1>
        <MarkdownBlock
          v-if="props.questionnaire.description"
          class="response-form-description"
          :content="props.questionnaire.description"
        />
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

    <div class="form-action-buttons-container">
      <div class="form-action-buttons">
        <slot name="buttons" />
      </div>
    </div>
  </form>
</template>

<style lang="scss" scoped>
.response-form-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
  max-width: 800px;
  margin: 0 auto;
  padding-bottom: 50vh;
  padding-right: 176px;
  box-sizing: content-box;
}

.response-form-nav {
  display: flex;
  align-items: center;
}

.back-button {
  color: var(--p-text-muted-color);
}

.response-form-title-row {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  padding: 24px 28px;
  border-radius: 12px;
  background: linear-gradient(
    135deg,
    color-mix(in srgb, var(--p-red-100) 50%, var(--p-surface-0)),
    color-mix(in srgb, var(--p-red-50) 35%, var(--p-surface-0))
  );
}

.response-form-title-area {
  display: flex;
  flex-direction: column;
  gap: 8px;
  min-width: 0;
  flex: 1;
}

.response-form-meta-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.meta-chip {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 3px 10px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 500;
  background-color: color-mix(
    in srgb,
    var(--p-surface-0) 70%,
    var(--p-surface-100)
  );
  color: var(--p-text-muted-color);
  border: 1px solid var(--p-surface-200);
}

.meta-chip-deadline {
  color: var(--p-orange-600);
  background-color: color-mix(in srgb, var(--p-orange-50) 60%, white);
  border-color: var(--p-orange-200);
}

.response-form-title {
  font-size: 22px;
  font-weight: 700;
  color: var(--p-text-color);
  margin: 0;
  line-height: 1.4;
}

.response-form-description {
  font-size: 14px;
  color: var(--p-text-muted-color);
}

.form-action-buttons-container {
  position: fixed;
  transform: translateX(832px);
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 180px;
  z-index: 10;
}

.form-action-buttons {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.question-elements {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

@media screen and (max-width: 1400px) {
  .form-action-buttons-container {
    position: static;
    transform: none;
    width: auto;
  }

  .form-action-buttons {
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    padding-top: 8px;
  }

  .response-form-container {
    padding-right: 0;
  }
}

@media screen and (max-width: 700px) {
  .response-form-title-row {
    flex-direction: column;
    padding: 20px;
  }

  .form-action-buttons {
    flex-direction: column;

    :deep(button) {
      width: 100%;
      justify-content: center;
    }
  }
}
</style>
