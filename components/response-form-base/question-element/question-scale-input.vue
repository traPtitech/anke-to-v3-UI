<script lang="ts" setup>
import type {
  ResponseFormQuestionInvalid,
  ResponseFormQuestionSettingsBase,
  ResponseFormQuestionSettingsScale,
} from '~/components/response-form-base/questionnaire-settings';
import type { ResponseSettingsScale } from '~/components/response-form-base/response-form-base-settings';

type ModelValue = ResponseSettingsScale &
  ResponseFormQuestionSettingsScale &
  ResponseFormQuestionSettingsBase &
  ResponseFormQuestionInvalid;

const props = defineProps<{
  modelValue: ModelValue;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: ModelValue): void;
}>();

const question = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
});

const optionLength = computed(
  () => question.value.maxValue - question.value.minValue + 1,
);

const scaleInputs = computed(() =>
  new Array(optionLength.value).fill('').map(() => createId()),
);

const name = computed(() => `scale-input-${createId()}`);
</script>

<template>
  <div class="question-scale-input-container">
    <div>
      {{ question.minLabel }}
    </div>
    <div
      v-for="(id, i) in scaleInputs"
      :key="id"
      class="question-scale-input-options"
    >
      <RadioButton
        v-model="question.number"
        :input-id="`${id}`"
        :value="i + question.minValue"
        :name="name"
        :aria-required="question.required"
        :pt="{ hiddenInput: { required: question.required } }"
        :class="{ 'p-invalid': question.isInvalid }"
      />
      <label :for="`${id}`">{{ i + question.minValue }}</label>
    </div>
    <div>
      {{ question.maxLabel }}
    </div>
  </div>
</template>

<style lang="scss" scoped>
.question-scale-input-container {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  max-width: calc(128px * v-bind(optionLength));
  margin: 0 auto;
}

.question-scale-input-options {
  display: flex;
  align-items: center;
  gap: 8px;
}

@media screen and (max-width: $breakpoint-sm) {
  .question-scale-input-container {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
    max-width: 100%;
  }
}
</style>
