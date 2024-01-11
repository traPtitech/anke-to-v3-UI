<script lang="ts" setup>
import {
  defaultQuestionSettingsByType,
  type ResponseSettings,
} from '~/components/new-response-form/new-response-form-settings';
import type {
  ResponseFormQuestionInvalid,
  ResponseFormQuestionSettings,
  ResponseFormQuestionnaireFormSettings,
} from '~/components/new-response-form/questionnaire-settings';

const route = useRoute();
const form = ref<HTMLFormElement | null>(null);

const props = defineProps<{
  formSettings: Omit<ResponseFormQuestionnaireFormSettings, 'questions'> & {
    questions: Omit<ResponseFormQuestionSettings, 'invalid'>[];
  };
}>();

const initialResponseSettings = props.formSettings.questions.map(
  (question) =>
    ({
      ...defaultQuestionSettingsByType[question.type],
      ...question,
      isInvalid: false,
    }) as ResponseSettings &
      ResponseFormQuestionSettings &
      ResponseFormQuestionInvalid,
);

const responseSettings = ref<
  (ResponseSettings &
    ResponseFormQuestionSettings &
    ResponseFormQuestionInvalid)[]
>(initialResponseSettings);

const responseViewableByOptions = {
  anyone: '全体',
  respondents: '回答した人のみ',
  admins: '管理者のみ',
} satisfies Record<
  ResponseFormQuestionnaireFormSettings['responseViewableBy'],
  string
>;

for (let i = 0; i < responseSettings.value.length; i++) {
  const question = responseSettings.value[i];
  if (!question.required) continue;

  switch (question.type) {
    case 'Text':
      watch(
        () => question.text,
        (text) => (responseSettings.value[i].isInvalid = text === ''),
      );
      break;
    case 'TextLong':
      watch(
        () => question.textLong,
        (textLong) => (responseSettings.value[i].isInvalid = textLong === ''),
      );
      break;

    case 'Number':
      watch(
        () => question.number,
        (number) => (responseSettings.value[i].isInvalid = number === null),
      );
      break;
    case 'SingleChoice':
      watch(
        () => question.index,
        (index) => (responseSettings.value[i].isInvalid = index === -1),
      );
      break;
    case 'MultipleChoice':
      watch(
        () => question.indexes,
        (indexes) =>
          (responseSettings.value[i].isInvalid = indexes.length === 0),
      );
      break;
    case 'Scale':
      watch(
        () => question.number,
        (number) => (responseSettings.value[i].isInvalid = number === -1),
      );
      break;
    default:
      {
        const _: never = question;
      }
      break;
  }
}

const handleEdit = () => {
  navigateTo('/responses/' + route.params.responseID + '/edit');
};
</script>

<template>
  <form ref="form" class="new-response-form-container">
    <div class="new-response-form-metadata-input">
      <h1>{{ props.formSettings.title }}</h1>
      <p>{{ props.formSettings.description }}</p>
      <div v-if="props.formSettings.isAnonymous">匿名回答</div>
      <div>
        公開範囲:
        {{ responseViewableByOptions[props.formSettings.responseViewableBy] }}
      </div>
      <div>
        回答期限:
        {{
          props.formSettings.responseDueDateTime !== null
            ? formatDate(new Date(props.formSettings.responseDueDateTime))
            : 'なし'
        }}
      </div>
    </div>
    <div class="question-elements">
      <QuestionElement
        v-for="(_, i) in responseSettings"
        :key="i"
        v-model="responseSettings[i]"
      />
    </div>
    <div class="form-action-buttons">
      <Button outlined class="form-action-button" @click="handleEdit">
        <Icon name="mdi:pencil-outline" size="24px" />
        <span>編集</span>
      </Button>
    </div>
  </form>
</template>

<style lang="scss" scoped>
.new-response-form-container {
  display: flex;
  flex-direction: column;
  gap: 16px;
  max-width: 800px;
  margin: 0 auto;
  padding-right: 144px;
  box-sizing: content-box;
  padding-bottom: 50vh;
}

.new-response-form-metadata-input {
  display: flex;
  flex-direction: column;
  gap: 16px;
  border: 1px solid var(--surface-d);
  border-radius: var(--border-radius);
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
