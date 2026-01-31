<script lang="ts" setup>
import type { QuestionnaireFormSettings } from '~/components/questionnaire-form/type';

const state = defineModel<QuestionnaireFormSettings>({ required: true });

type ResponseDueDateTimeOption =
  | 'no-due'
  | '1days'
  | '3days'
  | '1week'
  | 'custom';

const now = new Date();
const today = setTime(now, 23, 59, 0);
const responseDueDateTimeOptions = [
  { label: '期限なし', value: 'no-due' },
  { label: '明日まで', value: '1days' },
  { label: '3日後まで', value: '3days' },
  { label: '1週間後まで', value: '1week' },
  { label: 'カスタム', value: 'custom' },
] satisfies { label: string; value: ResponseDueDateTimeOption }[];

const isResponseDueDateTimeInvalidForTargets = computed(() => {
  if (state.value.response_due_date_time !== undefined) return false;

  return (
    state.value.target.users.length > 0 || state.value.target.groups.length > 0
  );
});
const isResponseDueDateTimeInvalidForDate = computed(() => {
  if (state.value.response_due_date_time === undefined) return false;

  return new Date(state.value.response_due_date_time) < new Date();
});

const responseDueDateTimeDropdown = ref<ResponseDueDateTimeOption>(
  state.value.response_due_date_time === undefined ? 'no-due' : 'custom',
);
const responseDueDateTimeInput = ref<Date>(
  state.value.response_due_date_time === undefined
    ? addDays(today, 7)
    : new Date(state.value.response_due_date_time),
);
const responseDueDateTimeInputDisabled = computed(() => {
  return responseDueDateTimeDropdown.value !== 'custom';
});

watch(
  responseDueDateTimeDropdown,
  (value) => {
    switch (value) {
      case 'no-due':
        state.value.response_due_date_time = undefined;
        break;
      case '1days':
        responseDueDateTimeInput.value = addDays(today, 1);
        break;
      case '3days':
        responseDueDateTimeInput.value = addDays(today, 3);
        break;
      case '1week':
        responseDueDateTimeInput.value = addDays(today, 7);
        break;
      case 'custom':
        state.value.response_due_date_time =
          responseDueDateTimeInput.value.toISOString();
        break;
    }
  },
  { immediate: true },
);

watch(
  responseDueDateTimeInput,
  (value) => (state.value.response_due_date_time = value.toISOString()),
);
</script>

<template>
  <div>
    <p class="form-label">回答期限</p>
    <Dropdown
      v-model="responseDueDateTimeDropdown"
      :class="{
        'p-invalid': isResponseDueDateTimeInvalidForTargets,
      }"
      :aria-invalid="isResponseDueDateTimeInvalidForDate ? 'true' : 'false'"
      :options="responseDueDateTimeOptions"
      option-label="label"
      option-value="value"
      scroll-height="320px"
    />
    <Calendar
      v-model="responseDueDateTimeInput"
      :class="{
        'p-invalid': isResponseDueDateTimeInvalidForDate,
      }"
      :aria-invalid="isResponseDueDateTimeInvalidForDate ? 'true' : 'false'"
      date-format="yy/mm/dd"
      show-time
      hour-format="24"
      show-icon
      icon-display="input"
      :disabled="responseDueDateTimeInputDisabled"
    />
    <small
      v-if="isResponseDueDateTimeInvalidForTargets"
      class="invalid-message"
    >
      <Icon name="mdi:alert-circle" size="20px" />
      <span>対象者を設定する場合「期限なし」にすることはできません</span>
    </small>
    <small v-if="isResponseDueDateTimeInvalidForDate" class="invalid-message">
      過去の日時を設定することはできません
    </small>
  </div>
</template>

<style lang="scss" scoped>
.form-label {
  font-weight: bold;
}

.invalid-message {
  display: flex;
  align-items: center;
  gap: 4px;
  color: var(--p-red-600);
}
</style>
