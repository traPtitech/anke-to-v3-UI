<script lang="ts" setup>
import type {
  QuestionBase,
  QuestionnaireDetail,
  QuestionnaireResponses,
  ResultInfo,
  ResultInfoByType,
} from './type';

const props = defineProps<{
  responses: QuestionnaireResponses;
  detail: QuestionnaireDetail;
}>();

const getAnswerFromResponse = (
  response: QuestionnaireResponses[number]['body'][number],
) => {
  const { question_type: type } = response;
  if (type === 'Text') return response.text;
  if (type === 'TextLong') return response.textLong;
  if (type === 'Number') return response.number;
  if (type === 'SingleChoice') return response.index;
  if (type === 'MultipleChoice') return response.indexes;
  if (type === 'Scale') return response.number;

  const _: never = response;
  throw new Error("This line shouldn't be reached");
};

const getResponseByQuestionIndex = (questionIndex: number) => {
  return props.responses
    .filter((res) => !res.is_draft)
    .map((res) => ({
      answer: getAnswerFromResponse(res.body[questionIndex]),
      // TODO: API定義が修正され次第直す
      user: 'cp20',
    }));
};

const resultInfoList = computed(() => {
  return props.detail.questions.map((question, i) => {
    return {
      ...question,
      isAnonymous: false,
      responses: getResponseByQuestionIndex(i),
    };
  }) as ResultInfo<false>[];
  // ^^^^  detailのquestionとresponseの型が一致することを保証できないので型アサーションする
});
</script>

<template>
  <div class="questionnaire-result-container">
    <div>
      <h1 class="questionnaire-title">{{ detail.title }}</h1>
      <div class="questionnaire-description">{{ detail.description }}</div>
    </div>
    <div
      v-for="(resultInfo, i) in resultInfoList"
      :key="i"
      class="questionnaire-result-element"
    >
      <div class="questionnaire-result-element-title">
        {{ resultInfo.title }}
      </div>
      <div class="questionnaire-result-element-description">
        {{ resultInfo.description }}
      </div>
      <TextResult
        v-if="resultInfo.question_type === 'Text'"
        :result-info="
          resultInfo as ResultInfoByType<'Text', false> & QuestionBase
        "
      />
      <TextLongResult
        v-else-if="resultInfo.question_type === 'TextLong'"
        :result-info="
          resultInfo as ResultInfoByType<'TextLong', false> & QuestionBase
        "
      />
      <NumberResult
        v-else-if="resultInfo.question_type === 'Number'"
        :result-info="
          resultInfo as ResultInfoByType<'Number', false> & QuestionBase
        "
      />
      <SingleChoiceResult
        v-else-if="resultInfo.question_type === 'SingleChoice'"
        :result-info="
          resultInfo as ResultInfoByType<'SingleChoice', false> & QuestionBase
        "
      />
      <MultipleChoiceResult
        v-else-if="resultInfo.question_type === 'MultipleChoice'"
        :result-info="
          resultInfo as ResultInfoByType<'MultipleChoice', false> & QuestionBase
        "
      />
      <ScaleResult
        v-else-if="resultInfo.question_type === 'Scale'"
        :result-info="
          resultInfo as ResultInfoByType<'Scale', false> & QuestionBase
        "
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.questionnaire-result-container {
  display: flex;
  flex-direction: column;
  gap: 16px;
  max-width: 1080px;
  margin: 0 auto;
  padding-bottom: 50vh;
}

.questionnaire-result-element {
  display: flex;
  flex-direction: column;
  gap: 8px;
  border: 1px solid var(--surface-d);
  border-radius: var(--border-radius);
  padding: 16px;
}

.questionnaire-result-element-title {
  font-weight: bold;
  font-size: 20px;
}

.questionnaire-result-element-description {
  margin-bottom: 16px;
}
</style>
