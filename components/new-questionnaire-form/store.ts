import type {
  NewQuestionnaireFormSettings,
  QuestionSettings,
  QuestionSettingsBase,
  QuestionSettingsByType,
  QuestionSettingsMultipleChoice,
  QuestionSettingsNumber,
  QuestionSettingsScale,
  QuestionSettingsSingleChoice,
  QuestionSettingsText,
  QuestionSettingsTextLong,
} from "~/components/new-questionnaire-form/type";

const defaultQuestionnaireFormSettings: NewQuestionnaireFormSettings = {
  title: "",
  description: "",
  response_due_date_time: undefined,
  response_viewable_by: "anyone",
  is_anonymous: false,
  is_duplicate_answer_allowed: false,
  target: {
    users: [],
    groups: [],
  },
  admin: {
    users: [],
    groups: [],
  },
  questions: [],
  is_published: false,
};

const defaultQuestionSettingsBase: QuestionSettingsBase = {
  question_id: createId(),
  title: "",
  description: "",
  is_required: false,
};

const defaultQuestionSettingsText: QuestionSettingsText = {
  question_type: "Text",
};

const defaultQuestionSettingsTextLong: QuestionSettingsTextLong = {
  question_type: "TextLong",
};

const defaultQuestionSettingsNumber: QuestionSettingsNumber = {
  question_type: "Number",
};

const defaultQuestionSettingsSingleChoice: QuestionSettingsSingleChoice = {
  question_type: "SingleChoice",
  options: [""],
};

const defaultQuestionSettingsMultipleChoice: QuestionSettingsMultipleChoice = {
  question_type: "MultipleChoice",
  options: [""],
};

const defaultQuestionSettingsScale: QuestionSettingsScale = {
  question_type: "Scale",
  min_value: 1,
  max_value: 5,
};

const defaultQuestionSettingsByType = {
  Text: defaultQuestionSettingsText,
  TextLong: defaultQuestionSettingsTextLong,
  Number: defaultQuestionSettingsNumber,
  SingleChoice: defaultQuestionSettingsSingleChoice,
  MultipleChoice: defaultQuestionSettingsMultipleChoice,
  Scale: defaultQuestionSettingsScale,
} satisfies Record<QuestionSettings["question_type"], QuestionSettingsByType>;

export const useStoreNewQuestionnaireForm = defineStore(
  "NewQuestionnaireForm",
  () => {
    const state = ref<NewQuestionnaireFormSettings>(
      defaultQuestionnaireFormSettings,
    );

    const addQuestion = (
      type: QuestionSettings["question_type"],
      index?: number,
    ) => {
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

    const copyQuestion = (id: number, index?: number) => {
      const question = state.value.questions.find(
        (question) => question.question_id === id,
      );
      if (question === undefined) return;

      const newQuestion = {
        ...question,
        question_id: createId(),
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

    const removeQuestion = (id: number) => {
      const index = state.value.questions.findIndex(
        (question) => question.question_id === id,
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
