<script lang="ts" setup>
import type { ResponseFormQuestionnaireFormSettings } from '~/components/response-form-base/questionnaire-settings';
const formSettings: ResponseFormQuestionnaireFormSettings = {
  title: 'アンケートのタイトル',
  description: 'アンケートの説明',
  isAnonymous: false,
  responseViewableBy: 'anyone',
  responseDueDateTime: null,
  admins: {
    users: ['cp20'],
    groups: [],
  },
  targets: {
    users: ['cp20'],
    groups: [],
  },
  isAllowMultiResponse: false,
  questions: [
    {
      title:
        'めっちゃめっちゃ長い質問文めっちゃめっちゃ長い質問文めっちゃめっちゃ長い質問文めっちゃめっちゃ長い質問文めっちゃめっちゃ長い質問文',
      description: '1行テキスト',
      type: 'Text',
      required: false,
    },
    {
      title: '質問2',
      description: '',
      type: 'TextLong',
      required: false,
    },
    {
      title: '質問3',
      description: '数値',
      type: 'Number',
      required: false,
    },
    {
      title: '質問4',
      description: 'ラジオボタン',
      type: 'SingleChoice',
      required: true,
      options: ['選択肢1', '選択肢2', '選択肢3'],
    },
    {
      title: '質問5',
      description: 'チェックボックス',
      type: 'MultipleChoice',
      required: true,
      options: ['選択肢1', '選択肢2', '選択肢3'],
    },
    {
      title: '質問6',
      description: '目盛り',
      type: 'Scale',
      required: true,
      minValue: 1,
      minLabel: '低い',
      maxValue: 5,
      maxLabel: '高い',
    },
  ],
};
const newResponseAPI = (
  _responseSettings: ResponseFormQuestionnaireFormSettings,
) => {
  console.log('response created');
  console.log(_responseSettings);
};
</script>

<template>
  <ResponseFormBase :form-settings="formSettings" :send-api="newResponseAPI">
    <template #saveButton>一時保存</template>
    <template #sendButton>送信</template>
  </ResponseFormBase>
</template>

<style lang="scss" scoped></style>
