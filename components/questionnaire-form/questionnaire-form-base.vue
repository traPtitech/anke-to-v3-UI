<script lang="ts" setup>
import { Container, Draggable } from 'vue3-smooth-dnd';
import { addQuestion, copyQuestion, removeQuestion } from './store';
import type { QuestionnaireFormSettings } from './type';

const state = defineModel<QuestionnaireFormSettings>({ required: true });
</script>

<template>
  <form class="new-questionnaire-form-container">
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
            @click="addQuestion(state, question.question_type, i)"
          >
            <Icon size="24px" name="mdi:plus-circle-outline" />
          </Button>
        </div>
        <FormControl
          class="question-control"
          :model-value="question"
          @update:model-value="Object.assign(state.questions[i], $event)"
          @copy="copyQuestion(state, question.question_id, i)"
          @delete="removeQuestion(state, question.question_id)"
        />
      </Draggable>
    </Container>
    <AddQuestionButtons @add-question="addQuestion(state, $event)" />
    <div class="form-action-buttons">
      <slot name="buttons" />
    </div>
  </form>
</template>

<style lang="scss" scoped>
.new-questionnaire-form-container {
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
  border: 1px solid var(--surface-d);
  border-radius: var(--border-radius);
  padding: 16px;
  display: flex;
  gap: 8px;
}

@media screen and (max-width: $breakpoint-sm) {
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

.form-action-buttons {
  position: fixed;
  top: 32px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  transform: translateX(1056px);
}

@media screen and (max-width: 1600px) {
  .form-action-buttons {
    position: static;
    transform: none;
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
  }

  .new-questionnaire-form-container {
    padding-right: 0;
  }
}

@media screen and (max-width: $breakpoint-sm) {
  .form-action-buttons {
    flex-direction: column;
  }
}
</style>
