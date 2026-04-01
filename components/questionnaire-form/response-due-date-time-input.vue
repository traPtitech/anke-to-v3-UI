<script lang="ts" setup>
import type { QuestionnaireFormSettings } from '~/components/questionnaire-form/type';

const state = defineModel<QuestionnaireFormSettings>({ required: true });

const now = new Date();
const today = setTime(now, 23, 59, 0);
const minSelectableDueDate = setTime(new Date(), 0, 0, 0);

type DueDatePreset = 'tomorrow' | 'three-days' | 'one-week';

const dueDatePresets: { label: string; value: DueDatePreset; days: number }[] =
  [
    { label: '明日', value: 'tomorrow', days: 1 },
    { label: '3日後', value: 'three-days', days: 3 },
    { label: '1週間後', value: 'one-week', days: 7 },
  ];

const isResponseDueDateTimeInvalidForTargets = computed(() => {
  if (state.value.response_due_date_time !== undefined) return false;

  return (
    state.value.target.users.length > 0 || state.value.target.groups.length > 0
  );
});
const hasTargets = computed(
  () =>
    state.value.target.users.length > 0 || state.value.target.groups.length > 0,
);
const isResponseDueDateTimeInvalidForDate = computed(() => {
  if (state.value.response_due_date_time === undefined) return false;

  return new Date(state.value.response_due_date_time) < new Date();
});

const useCustomDueTime = ref(state.value.response_due_date_time !== undefined);
const responseDueDateTimeInput = ref<Date>(
  state.value.response_due_date_time === undefined
    ? addDays(today, 7)
    : new Date(state.value.response_due_date_time),
);
const selectedDueDatePreset = ref<DueDatePreset | null>(
  state.value.response_due_date_time === undefined ? null : 'one-week',
);

const handleSelectDueDatePreset = (preset: (typeof dueDatePresets)[number]) => {
  useCustomDueTime.value = true;
  const presetDate = addDays(today, preset.days);
  responseDueDateTimeInput.value = presetDate;
  state.value.response_due_date_time = presetDate.toISOString();
  selectedDueDatePreset.value = preset.value;
};

watch(
  useCustomDueTime,
  (value) => {
    if (value) {
      state.value.response_due_date_time =
        responseDueDateTimeInput.value.toISOString();
    } else {
      state.value.response_due_date_time = undefined;
      selectedDueDatePreset.value = null;
    }
  },
  { immediate: true },
);

watch(responseDueDateTimeInput, (value) => {
  if (!useCustomDueTime.value) return;
  state.value.response_due_date_time = value.toISOString();
  selectedDueDatePreset.value = null;
});

watch(hasTargets, (value) => {
  if (!value) return;
  useCustomDueTime.value = true;
});
</script>

<template>
  <div class="response-due-date-time-input">
    <div class="response-due-date-time-input-title">
      <p class="form-label">回答期限</p>
      <div class="due-date-mode-options">
        <label class="due-date-mode-option">
          <span>設定する</span>

          <ToggleSwitch
            v-model="useCustomDueTime"
            input-id="response-due-date-no-due"
            binary
          />
        </label>
      </div>
    </div>

    <DatePicker
      v-if="useCustomDueTime"
      v-model="responseDueDateTimeInput"
      :min-date="minSelectableDueDate"
      :class="{
        'p-invalid': isResponseDueDateTimeInvalidForDate,
      }"
      :aria-invalid="isResponseDueDateTimeInvalidForDate ? 'true' : 'false'"
      date-format="yy/mm/dd"
      show-time
      hour-format="24"
      show-icon
      icon-display="input"
    ></DatePicker>
    <div v-if="useCustomDueTime" class="due-date-presets">
      <Button
        v-for="preset in dueDatePresets"
        :key="preset.value"
        size="small"
        :outlined="selectedDueDatePreset !== preset.value"
        :severity="
          selectedDueDatePreset === preset.value ? 'primary' : 'secondary'
        "
        @click="handleSelectDueDatePreset(preset)"
      >
        {{ preset.label }}
      </Button>
    </div>
    <small
      v-if="isResponseDueDateTimeInvalidForTargets"
      class="invalid-message"
    >
      <Icon name="mdi:alert-circle" size="20px" />
      <span>対象者を設定する場合「期限なし」にすることはできません</span>
    </small>

    <small v-if="isResponseDueDateTimeInvalidForDate" class="invalid-message">
      <Icon name="mdi:alert-circle" size="20px" />
      過去の日時を設定することはできません
    </small>
  </div>
</template>

<style lang="scss" scoped>
.response-due-date-time-input {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.response-due-date-time-input-title {
  display: flex;
  flex-direction: row;
  gap: 32px;
  align-items: center;
}

.form-label {
  font-weight: bold;
}

.due-date-mode-options {
  display: flex;
  gap: 20px;
  align-items: center;
}

.due-date-mode-option {
  display: flex;
  gap: 8px;
  align-items: center;
}

.due-date-presets {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.invalid-message {
  display: flex;
  align-items: center;
  gap: 4px;
  color: var(--p-red-500);
}
</style>
