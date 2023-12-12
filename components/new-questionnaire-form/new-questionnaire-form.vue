<script lang="ts" setup>
import { Container, Draggable } from 'vue3-smooth-dnd';

const form = ref<HTMLFormElement | null>(null);

const emit = defineEmits<{
  (e: 'save', value: QuestionnaireFormSettings): void;
  (e: 'send', value: QuestionnaireFormSettings): void;
}>();

const { state, addQuestion, copyQuestion, removeQuestion } =
  useStoreNewQuestionnaireForm();

const isResponseDueDateTimeInvalidForTargets = computed(() => {
  if (state.responseDueDateTime !== null) return false;

  return state.targets.users.length > 0 || state.targets.groups.length > 0;
});
const isResponseDueDateTimeInvalidForDate = computed(() => {
  if (state.responseDueDateTime === null) return false;

  return new Date(state.responseDueDateTime) < new Date();
});

const checkValidity = () => {
  if (form.value === null) return false;

  form.value.reportValidity();
  if (!form.value.checkValidity()) return false;

  if (isResponseDueDateTimeInvalidForTargets.value) return false;
  if (isResponseDueDateTimeInvalidForDate.value) return false;
  if (state.questions.length === 0) return false;

  return true;
};

const handleSend = () => {
  if (!checkValidity()) return;
  emit('send', state);
};

const handleSave = () => {
  emit('save', state);
};
</script>

<template>
  <form ref="form" class="new-questionnaire-form-container">
    <QuestionnaireMetadataInput
      v-model="state"
      :is-response-due-date-time-invalid-for-targets="
        isResponseDueDateTimeInvalidForTargets
      "
      :is-response-due-date-time-invalid-for-date="
        isResponseDueDateTimeInvalidForDate
      "
    />
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
        :key="question.id"
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
            @click="addQuestion(question.type, i)"
          >
            <Icon size="24px" name="mdi:plus-circle-outline" />
          </Button>
        </div>
        <FormControl
          class="question-control"
          :model-value="question"
          @update:model-value="Object.assign(state.questions[i], $event)"
          @copy="copyQuestion(question.id, i)"
          @delete="removeQuestion(question.id)"
        />
      </Draggable>
    </Container>
    <AddQuestionButtons @add-question="addQuestion($event)" />

    <div class="form-action-buttons">
      <Button outlined class="form-action-button" @click="handleSave">
        <Icon name="mdi:content-save" size="24px" />
        <span>一時保存</span>
      </Button>
      <Button class="form-action-button" @click="handleSend">
        <Icon name="mdi:send" size="24px" />
        <span>送信</span>
      </Button>
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

.form-action-button {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-weight: bold;
}

@media screen and (max-width: $breakpoint-sm) {
  .form-action-buttons {
    flex-direction: column;
  }
}
</style>
