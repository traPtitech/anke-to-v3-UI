<script lang="ts" setup>
import {
  useQuestionValidity,
  type QuestionElementMode,
  type QuestionElementScale,
} from './composables';
import QuestionAnswerEmpty from './question-answer-empty.vue';
import QuestionAnswerText from './question-answer-text.vue';
import QuestionAnswerView from './question-answer-view.vue';

const props = defineProps<{
  mode: QuestionElementMode;
}>();

const question = defineModel<QuestionElementScale>({ required: true });
const { valid } = useQuestionValidity(question.value);

const name = `scale-input-${useId()}`;
</script>

<template>
  <QuestionAnswerView v-if="props.mode === 'view'">
    <span v-if="question.answer !== undefined" class="scale-answer-display">
      <Icon name="mdi:star" size="16px" class="scale-answer-star" />
      <QuestionAnswerText>
        {{ question.answer }} / {{ question.max_value }}
        <span class="scale-answer-sub">
          ({{ question.min_label }} — {{ question.max_label }})
        </span>
      </QuestionAnswerText>
    </span>
    <QuestionAnswerEmpty v-else />
  </QuestionAnswerView>
  <div v-else class="question-element-scale-container">
    <span class="scale-edge-label">{{ question.min_label }}</span>
    <div class="rating-wrapper">
      <Rating
        v-model="question.answer"
        :name="name"
        :aria-required="question.is_required"
        :pt="{ hiddenOptionInput: { required: question.is_required } }"
        :stars="question.max_value - question.min_value + 1"
        :invalid="!valid"
      />
      <div class="rating-labels">
        <span class="rating-label">{{ question.min_value }}</span>
        <span class="rating-label">{{ question.max_value }}</span>
      </div>
    </div>
    <span class="scale-edge-label">{{ question.max_label }}</span>
  </div>
</template>

<style lang="scss" scoped>
.question-element-scale-container {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 12px;
}

.scale-edge-label {
  font-size: 13px;
  color: var(--p-text-muted-color);
  white-space: nowrap;
}

.rating-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.rating-labels {
  display: flex;
  justify-content: space-between;
  width: 100%;
  margin-top: 4px;
}

.rating-label {
  display: inline-block;
  text-align: center;
  width: 20px;
  font-size: 12px;
  color: var(--p-text-muted-color);
}

.scale-answer-display {
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.scale-answer-star {
  color: var(--p-yellow-400);
}

.scale-answer-sub {
  font-size: 12px;
  color: var(--p-text-muted-color);
  margin-left: 4px;
}

@media screen and (max-width: variables.$breakpoint-sm) {
  .question-element-scale-container {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
}
</style>
