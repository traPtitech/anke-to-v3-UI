<script lang="ts" setup>
import {
  useQuestionValidity,
  type QuestionElementMode,
  type QuestionElementScale,
} from './composables';

const props = defineProps<{
  mode: QuestionElementMode;
}>();

const question = defineModel<QuestionElementScale>({ required: true });
const { valid } = useQuestionValidity(question.value);

const name = `scale-input-${useId()}`;
</script>

<template>
  <div class="question-element-scale-container">
    <div>
      {{ question.min_label }}
    </div>
    <div class="rating-wrapper">
      <Rating
        v-model="question.answer"
        :name="name"
        :aria-required="question.is_required"
        :pt="{ hiddenOptionInput: { required: question.is_required } }"
        :readonly="props.mode === 'view'"
        :stars="question.max_value - question.min_value + 1"
        :invalid="!valid"
      />
      <div class="rating-labels">
        <span class="rating-label">
          {{ question.min_value }}
        </span>
        <span class="rating-label">
          {{ question.max_value }}
        </span>
      </div>
    </div>
    <div>
      {{ question.max_label }}
    </div>
  </div>
</template>

<style lang="scss" scoped>
.question-element-scale-container {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin: 0 auto;
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
}

@media screen and (max-width: variables.$breakpoint-sm) {
  .question-element-scale-container {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
    max-width: 100%;
  }
}
</style>
