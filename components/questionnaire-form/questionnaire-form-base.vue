<script lang="ts" setup>
import { Container, Draggable } from 'vue3-smooth-dnd';
import AddQuestionButtons from './add-question-buttons.vue';
import FormControl from './form-control.vue';
import QuestionnaireMetadataInput from './questionnaire-metadata-input.vue';
import {
  addQuestion,
  copyQuestion,
  getValidationErrors,
  removeQuestion,
} from './store';
import type { QuestionnaireFormSettings } from './type';

const state = defineModel<QuestionnaireFormSettings>({ required: true });
const validationErrors = computed(() =>
  getValidationErrors(state.value).filter(({ display }) => display),
);
const focusedQuestionId = ref<number | null>(null);

const handleAddQuestion = (
  type: Parameters<typeof addQuestion>[1],
  index?: number,
) => {
  focusedQuestionId.value = addQuestion(state.value, type, index);
};
</script>

<template>
  <form class="questionnaire-form-container">
    <QuestionnaireMetadataInput v-model="state" />
    <Container
      class="questions-container"
      drag-handle-selector=".drag-handle"
      lock-axis="y"
      @drop="
        state.questions = moveInArray(
          state.questions,
          $event.removedIndex,
          $event.addedIndex,
        )
      "
    >
      <Draggable
        v-for="(question, i) in state.questions"
        :key="question.question_id"
        class="question-container"
      >
        <div class="question-side-buttons">
          <div class="drag-handle">
            <Icon
              size="24px"
              name="ic:outline-drag-indicator"
              class="drag-icon"
            />
          </div>
          <Button
            text
            class="p-button-icon-only question-add-button"
            title="質問を追加"
            @click="handleAddQuestion(question.question_type, i)"
          >
            <Icon size="24px" name="mdi:plus-circle-outline" />
          </Button>
        </div>
        <FormControl
          class="question-control"
          :model-value="question"
          :auto-focus-title="focusedQuestionId === question.question_id"
          @update:model-value="Object.assign(state.questions[i], $event)"
          @copy="copyQuestion(state, question.question_id, i)"
          @delete="removeQuestion(state, question.question_id)"
        />
      </Draggable>
    </Container>
    <AddQuestionButtons @add-question="handleAddQuestion" />
    <div class="form-action-buttons-container">
      <div class="form-action-buttons">
        <slot name="buttons" />
      </div>
      <div
        v-if="validationErrors.length > 0"
        class="form-validation-error-messages"
      >
        <small
          v-for="{ message } in validationErrors"
          :key="message"
          class="form-validation-error-message"
        >
          <Icon size="20px" name="mdi:alert-circle" />
          <span>
            {{ message }}
          </span>
        </small>
      </div>
    </div>
  </form>
</template>

<style lang="scss" scoped>
.questionnaire-form-container {
  display: flex;
  flex-direction: column;
  gap: 16px;
  max-width: 1024px;
  padding-bottom: 320px;
  margin: 0 auto;
  padding-right: 176px;
  box-sizing: content-box;
}

.questions-container {
  display: flex;
  flex-direction: column;
  gap: 16px;
  min-height: 32px;
}

/* smooth-dndのスタイルを上書きするために詳細度を上げる */
.question-container.question-container.question-container {
  border: 1px solid var(--p-surface-300);
  border-radius: var(--p-border-radius-md);
  padding: 16px;
  display: flex;
  gap: 8px;
}

@media screen and (max-width: variables.$breakpoint-sm) {
  .question-container.question-container.question-container {
    padding: 8px 8px 8px 4px;
    gap: 4px;
  }
}

.question-side-buttons {
  display: flex;
  flex-direction: column;
  gap: 16px;
  align-items: center;
  padding: 8px 0;
}

.drag-handle {
  cursor: move;
}

.question-add-button {
  padding: 4px;
  width: 2rem;
  height: 2rem;
}

.question-control {
  flex: 1;
}

.form-action-buttons-container {
  position: fixed;
  top: 32px;
  transform: translateX(1056px);
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 180px;
}

.form-action-buttons {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-validation-error-message {
  display: flex;
  align-items: center;
  gap: 4px;
  color: var(--p-red-600);
  justify-content: end;
}

.form-validation-error-messages {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

@media screen and (max-width: 1600px) {
  .form-action-buttons-container {
    position: static;
    transform: none;
    width: auto;
  }

  .form-action-buttons {
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
  }

  .questionnaire-form-container {
    padding-right: 0;
  }
}

@media screen and (max-width: variables.$breakpoint-sm) {
  .form-action-buttons {
    flex-direction: column;
  }
}
</style>
