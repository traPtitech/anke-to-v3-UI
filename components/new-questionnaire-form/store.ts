import type {
  QuestionSettings,
  QuestionSettingsBase,
  QuestionSettingsByType,
  QuestionSettingsMultipleChoice,
  QuestionSettingsNumber,
  QuestionSettingsScale,
  QuestionSettingsSingleChoice,
  QuestionSettingsText,
  QuestionSettingsTextLong,
  QuestionnaireFormSettings,
} from '~/components/new-questionnaire-form/type';

const defaultQuestionnaireFormSettings: QuestionnaireFormSettings = {
  title: '',
  description: '',
  responseDueDateTime: null,
  responseViewableBy: 'anyone',
  isAnonymous: false,
  isAllowingMultipleResponses: false,
  targets: {
    users: [],
    groups: [],
  },
  admins: {
    users: [],
    groups: [],
  },
  questions: [],
};

const defaultQuestionSettingsBase: QuestionSettingsBase = {
  id: createId(),
  title: '',
  description: '',
  required: false,
};

const defaultQuestionSettingsText: QuestionSettingsText = {
  type: 'Text',
};

const defaultQuestionSettingsTextLong: QuestionSettingsTextLong = {
  type: 'TextLong',
};

const defaultQuestionSettingsNumber: QuestionSettingsNumber = {
  type: 'Number',
};

const defaultQuestionSettingsSingleChoice: QuestionSettingsSingleChoice = {
  type: 'SingleChoice',
  options: [],
};

const defaultQuestionSettingsMultipleChoice: QuestionSettingsMultipleChoice = {
  type: 'MultipleChoice',
  options: [],
};

const defaultQuestionSettingsScale: QuestionSettingsScale = {
  type: 'Scale',
  minValue: 1,
  maxValue: 5,
};

const defaultQuestionSettingsByType = {
  Text: defaultQuestionSettingsText,
  TextLong: defaultQuestionSettingsTextLong,
  Number: defaultQuestionSettingsNumber,
  SingleChoice: defaultQuestionSettingsSingleChoice,
  MultipleChoice: defaultQuestionSettingsMultipleChoice,
  Scale: defaultQuestionSettingsScale,
} satisfies Record<QuestionSettings['type'], QuestionSettingsByType>;

export const useStoreNewQuestionnaireForm = defineStore(
  'NewQuestionnaireForm',
  () => {
    const state = ref<QuestionnaireFormSettings>(
      defaultQuestionnaireFormSettings,
    );

    const addQuestion = (type: QuestionSettings['type'], index?: number) => {
      const newQuestion = {
        ...defaultQuestionSettingsBase,
        ...defaultQuestionSettingsByType[type],
      };

      if (index === undefined) {
        state.value.questions.push(newQuestion);
        return;
      }

      state.value.questions = insertToArray(
        state.value.questions,
        index + 1,
        newQuestion,
      );
    };

    const copyQuestion = (id: string, index?: number) => {
      const question = state.value.questions.find(
        (question) => question.id === id,
      );
      if (question === undefined) return;

      const newQuestion = {
        ...question,
        id: createId(),
      };

      if (index === undefined) {
        state.value.questions.push(newQuestion);
        return;
      }

      state.value.questions = insertToArray(
        state.value.questions,
        index + 1,
        newQuestion,
      );
    };

    const removeQuestion = (id: string) => {
      const index = state.value.questions.findIndex(
        (question) => question.id === id,
      );
      if (index !== -1) {
        state.value.questions.splice(index, 1);
      }
    };

    return {
      state,
      addQuestion,
      copyQuestion,
      removeQuestion,
    };
  },
);
