import type {
  QuestionnaireFormSettings,
  QuestionSettings,
  QuestionSettingsBase,
  QuestionSettingsByType,
  QuestionSettingsMultipleChoice,
  QuestionSettingsNumber,
  QuestionSettingsScale,
  QuestionSettingsSingleChoice,
  QuestionSettingsText,
  QuestionSettingsTextLong,
} from "./type";

const defaultQuestionnaireFormSettings: QuestionnaireFormSettings = {
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
    const state = ref<QuestionnaireFormSettings>(
      defaultQuestionnaireFormSettings,
    );
    return { state };
  },
);

export const addQuestion = (
  state: QuestionnaireFormSettings,
  type: QuestionSettings["question_type"],
  index?: number,
) => {
  const newQuestion = {
    ...defaultQuestionSettingsBase,
    ...defaultQuestionSettingsByType[type],
  };

  if (index === undefined) {
    state.questions.push(newQuestion);
    return true;
  }

  state.questions = insertToArray(
    state.questions,
    index + 1,
    newQuestion,
  );
  return true;
};

export const copyQuestion = (
  state: QuestionnaireFormSettings,
  id: number,
  index?: number,
) => {
  const question = state.questions.find((q) => q.question_id === id);
  if (question === undefined) return false;

  const newQuestion = {
    ...question,
    question_id: createId(),
  };

  if (index === undefined) {
    state.questions.push(newQuestion);
    return true;
  }

  state.questions = insertToArray(
    state.questions,
    index + 1,
    newQuestion,
  );
  return true;
};

export const removeQuestion = (
  state: QuestionnaireFormSettings,
  id: number,
) => {
  const index = state.questions.findIndex((q) => q.question_id === id);
  if (index === -1) return false;
  state.questions.splice(index, 1);
  return true;
};

type Validity = { ok: true } | { ok: false; message: string };
export const checkValidity = (
  state: QuestionnaireFormSettings,
): Validity => {
  if (state.title.trim() === "") {
    return { ok: false, message: "アンケートのタイトルを入力してください" };
  }

  if (
    state.response_due_date_time !== undefined &&
    new Date(state.response_due_date_time) < new Date()
  ) {
    return {
      ok: false,
      message: "回答期限は未来の日時を指定してください",
    };
  }

  if (
    (state.target.users.length > 0 || state.target.groups.length > 0) &&
    state.response_due_date_time === undefined
  ) {
    return {
      ok: false,
      message: "対象者が設定されている場合、回答期限は設定必須です",
    };
  }

  if (state.admin.users.length === 0 && state.admin.groups.length === 0) {
    return { ok: false, message: "アンケートの管理者を設定してください" };
  }

  if (state.questions.length === 0) {
    return { ok: false, message: "アンケートに質問を追加してください" };
  }

  if (state.questions.some((q) => q.title.trim() === "")) {
    return { ok: false, message: "タイトルが空欄の質問があります" };
  }

  if (
    state.questions.some((q) =>
      (q.question_type === "SingleChoice" ||
        q.question_type === "MultipleChoice") && q.options.length === 0
    )
  ) {
    return { ok: false, message: "選択肢がない質問があります" };
  }

  if (
    state.questions.some(
      (q) =>
        (q.question_type === "SingleChoice" ||
          q.question_type === "MultipleChoice") &&
        q.options.some((o) => o.trim() === ""),
    )
  ) {
    return { ok: false, message: "選択肢に空欄が含まれる質問があります" };
  }

  return { ok: true };
};
