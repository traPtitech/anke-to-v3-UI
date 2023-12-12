<script lang="ts" setup>
import { Container, Draggable } from 'vue3-smooth-dnd';

defineEmits<{
  (e: 'save', value: QuestionnaireFormSettings): void;
  (e: 'send', value: QuestionnaireFormSettings): void;
}>();

const { state, addQuestion, copyQuestion, removeQuestion } =
  useStoreNewQuestionnaireForm();

const responseViewableByOptions = [
  {
    label: '全体',
    value: 'anyone',
  },
  {
    label: '回答した人のみ',
    value: 'respondents',
  },
  {
    label: '管理者のみ',
    value: 'admins',
  },
] satisfies {
  label: string;
  value: QuestionnaireFormSettings['responseViewableBy'];
}[];

type ResponseDueDateTimeOption =
  | 'no-due'
  | '1days'
  | '3days'
  | '1week'
  | 'custom';

const now = new Date();
const today = setTime(now, 23, 59, 0);
const responseDueDateTimeOptions = [
  { label: '期限なし', value: 'no-due' },
  { label: '明日まで', value: '1days' },
  { label: '3日後まで', value: '3days' },
  { label: '1週間後まで', value: '1week' },
  { label: 'カスタム', value: 'custom' },
] satisfies { label: string; value: ResponseDueDateTimeOption }[];

const responseDueDateTimeDropdown = ref<ResponseDueDateTimeOption>('no-due');
const responseDueDateTimeInput = ref<Date>(addDays(today, 7));
const responseDueDateTimeInputDisabled = computed(() => {
  return responseDueDateTimeDropdown.value !== 'custom';
});

watch(
  responseDueDateTimeDropdown,
  (value) => {
    switch (value) {
      case 'no-due':
        state.responseDueDateTime = null;
        break;
      case '1days':
        responseDueDateTimeInput.value = addDays(today, 1);
        break;
      case '3days':
        responseDueDateTimeInput.value = addDays(today, 3);
        break;
      case '1week':
        responseDueDateTimeInput.value = addDays(today, 7);
        break;
      case 'custom':
        state.responseDueDateTime =
          responseDueDateTimeInput.value.toISOString();
        break;
    }
  },
  { immediate: true },
);

watch(
  responseDueDateTimeInput,
  (value) => (state.responseDueDateTime = value.toISOString()),
);

const isResponseDueDateTimeInvalidForTargets = computed(() => {
  if (state.responseDueDateTime !== null) return false;

  return state.targets.users.length > 0 || state.targets.groups.length > 0;
});
const isResponseDueDateTimeInvalidForDate = computed(() => {
  if (state.responseDueDateTime === null) return false;

  return new Date(state.responseDueDateTime) < new Date();
});
</script>

<template>
  <form class="new-questionnaire-form-container">
    <div class="questionnaire-metadata-input-container">
      <InputText
        v-model="state.title"
        size="large"
        required
        placeholder="アンケートのタイトル"
      />
      <Textarea v-model="state.description" placeholder="アンケートの説明" />
      <div class="form-elements">
        <div class="form-element">
          <p class="form-label">結果の公開範囲</p>
          <Dropdown
            v-model="state.responseViewableBy"
            :options="responseViewableByOptions"
            option-label="label"
            option-value="value"
            scroll-height="320px"
          />
        </div>
        <div class="form-element">
          <p class="form-label">回答期限</p>
          <Dropdown
            v-model="responseDueDateTimeDropdown"
            :class="{
              'p-invalid': isResponseDueDateTimeInvalidForTargets,
            }"
            :aria-invalid="
              isResponseDueDateTimeInvalidForDate ? 'true' : 'false'
            "
            :options="responseDueDateTimeOptions"
            option-label="label"
            option-value="value"
            scroll-height="320px"
          />
          <Calendar
            v-model="responseDueDateTimeInput"
            :class="{
              'p-invalid': isResponseDueDateTimeInvalidForDate,
            }"
            :aria-invalid="
              isResponseDueDateTimeInvalidForDate ? 'true' : 'false'
            "
            date-format="yy/mm/dd"
            show-time
            hour-format="24"
            show-icon
            icon-display="input"
            :disabled="responseDueDateTimeInputDisabled"
          />
          <small
            v-if="isResponseDueDateTimeInvalidForTargets"
            class="invalid-message"
          >
            対象者を設定する場合「期限なし」にすることはできません
          </small>
          <small
            v-if="isResponseDueDateTimeInvalidForDate"
            class="invalid-message"
          >
            過去の日時を設定することはできません
          </small>
        </div>
        <div class="form-element">
          <p class="form-label">対象者</p>
          <small>未回答の対象者は自動でリマインドされます</small>
          <UserSpecifierInput v-model="state.targets" />
        </div>
        <div class="form-element">
          <p class="form-label">管理者</p>
          <small>管理者はアンケートを編集できます</small>
          <UserSpecifierInput v-model="state.admins" />
        </div>
        <div class="form-element form-bottom-switch">
          <p class="form-label">1人が複数回答できるか</p>
          <InputSwitch v-model="state.isAllowingMultipleResponses" />
        </div>
        <div class="form-element form-bottom-switch">
          <p class="form-label">回答を匿名にするか</p>
          <InputSwitch v-model="state.isAnonymous" />
        </div>
      </div>
    </div>
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
    <Panel header="新しい質問を追加する">
      <div class="add-question-buttons">
        <Button
          class="add-question-button"
          outlined
          @click="addQuestion('text')"
        >
          <Icon size="24px" name="ic:outline-short-text" />
          <span>1行テキスト</span>
        </Button>
        <Button
          class="add-question-button"
          outlined
          @click="addQuestion('text-long')"
        >
          <Icon size="24px" name="mdi:text" />
          <span>長文テキスト</span>
        </Button>
        <Button
          class="add-question-button"
          outlined
          @click="addQuestion('number')"
        >
          <Icon size="24px" name="mdi:numeric" />
          <span>数値</span>
        </Button>
        <Button
          class="add-question-button"
          outlined
          @click="addQuestion('multiple-choice')"
        >
          <Icon size="24px" name="mdi:checkbox-outline" />
          <span>チェックボックス</span>
        </Button>
        <Button
          class="add-question-button"
          outlined
          @click="addQuestion('single-choice')"
        >
          <Icon size="24px" name="mdi:radiobox-marked" />
          <span>ラジオボタン</span>
        </Button>
        <Button
          class="add-question-button"
          outlined
          @click="addQuestion('scale')"
        >
          <Icon size="24px" name="ic:outline-linear-scale" />
          <span>目盛り</span>
        </Button>
      </div>
    </Panel>

    <div class="form-action-buttons">
      <Button outlined class="form-action-button" @click="$emit('save', state)">
        <Icon name="mdi:content-save" size="24px" />
        <span>一時保存</span>
      </Button>
      <Button class="form-action-button" @click="$emit('send', state)">
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

.questionnaire-metadata-input-container {
  display: flex;
  flex-direction: column;
  gap: 16px;
  border: 1px solid var(--surface-d);
  border-radius: var(--border-radius);
  padding: 16px;
}

.form-elements {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 32px 16px;
  margin-top: 16px;
}

@media screen and (max-width: $breakpoint-lg) {
  .form-elements {
    grid-template-columns: 1fr;
  }
}

.form-element-group {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.form-element {
  display: flex;
  flex-direction: column;
  gap: 8px;
  min-width: 0;
}

.form-bottom-switch {
  display: flex;
  flex-direction: row;
  gap: 16px;
  align-items: center;
}

.form-label {
  font-weight: bold;
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

.add-question-section-title {
  font-weight: bold;
  font-size: large;
}

.add-question-buttons {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}

@media screen and (max-width: $breakpoint-lg) {
  .add-question-buttons {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media screen and (max-width: 620px) {
  .add-question-buttons {
    grid-template-columns: 1fr;
  }
}

.add-question-button {
  display: flex;
  gap: 8px;
  padding: 8px 12px;
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

.invalid-message {
  color: #f26451;
}
</style>
