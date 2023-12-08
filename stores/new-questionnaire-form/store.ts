import { defineStore } from 'pinia';
import type { QuestionnaireFormSettings } from './type';

const useStoreNewQuestionnaireFormPinia = defineStore(
  'NewQuestionnaireForm',
  () => {
    const state = ref<QuestionnaireFormSettings>({
      title: '',
      description: '',
      responseDueDateTime: undefined,
      responseViewableBy: 'public',
      targets: {
        users: [],
        groups: [],
      },
      administrators: {
        users: [],
        groups: [],
      },
      questions: [
        {
          id: createId(),
          type: 'text',
          title: '1行テキスト',
          description: '',
          required: false,
        },
        {
          id: createId(),
          type: 'text-long',
          title: '長文テキスト',
          description: '',
          required: false,
        },
        {
          id: createId(),
          type: 'scale',
          title: 'スケール',
          description: '',
          required: false,
          maxValue: 5,
          minValue: 1,
        },
        {
          id: createId(),
          type: 'number',
          title: '数字',
          description: '',
          required: false,
        },
        {
          id: createId(),
          type: 'single-choice',
          title: 'ラジオボタン',
          description: '',
          required: false,
          options: [
            { id: createId(), label: '選択肢1' },
            { id: createId(), label: '選択肢2' },
            { id: createId(), label: '選択肢3' },
          ],
        },
        {
          id: createId(),
          type: 'multiple-choice',
          title: 'チェックボックス',
          description: '',
          required: false,
          options: [
            { id: createId(), label: '選択肢1' },
            { id: createId(), label: '選択肢2' },
            { id: createId(), label: '選択肢3' },
          ],
        },
      ],
    });

    return { state };
  },
);

export const useStoreNewQuestionnaireForm = () =>
  storeToRefs(useStoreNewQuestionnaireFormPinia());
