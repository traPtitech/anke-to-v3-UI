<script lang="ts" setup>
import ChipSelectRow from '~/components/ui/chip-select-row.vue';
import type { QuestionnaireFormSettings } from '~/components/questionnaire-form/type';

const state = defineModel<QuestionnaireFormSettings>({ required: true });

const today = setTime(new Date(), 23, 59, 0);
const minSelectableDueDate = setTime(new Date(), 0, 0, 0);

const dueDatePresets = [
  { label: '明日', value: 'tomorrow', days: 1 },
  { label: '3日後', value: 'three-days', days: 3 },
  { label: '1週間後', value: 'one-week', days: 7 },
] as const satisfies { label: string; value: string; days: number }[];

type DueDatePresetItem = (typeof dueDatePresets)[number];
type DueDatePreset = DueDatePresetItem['value'];

const getMatchingDueDatePreset = (date: Date): DueDatePreset | null => {
  const dateIso = date.toISOString();
  const dateKey = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;

  const matchedPreset = dueDatePresets.find((preset) => {
    const presetDate = addDays(today, preset.days);

    if (presetDate.toISOString() === dateIso) return true;

    const presetDateKey = `${presetDate.getFullYear()}-${presetDate.getMonth()}-${presetDate.getDate()}`;
    return presetDateKey === dateKey;
  });

  return matchedPreset?.value ?? null;
};

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

const getDefaultDueDate = () => addDays(today, 7);

const useCustomDueTime = ref(state.value.response_due_date_time !== undefined);
const responseDueDateTimeInput = ref<Date>(
  state.value.response_due_date_time === undefined
    ? getDefaultDueDate()
    : new Date(state.value.response_due_date_time),
);
const selectedDueDatePreset = computed<DueDatePreset | null>(() =>
  state.value.response_due_date_time === undefined
    ? null
    : getMatchingDueDatePreset(new Date(state.value.response_due_date_time)),
);

const dueDatePresetChipItems = computed(() =>
  dueDatePresets.map((preset) => ({
    key: preset.value,
    label: preset.label,
  })),
);

const handleSelectDueDatePreset = (preset: DueDatePresetItem) => {
  useCustomDueTime.value = true;
  const presetDate = addDays(today, preset.days);
  responseDueDateTimeInput.value = presetDate;
  state.value.response_due_date_time = presetDate.toISOString();
};

const handleSelectDueDatePresetByValue = (value: string) => {
  const preset = dueDatePresets.find((item) => item.value === value);
  if (preset === undefined) return;
  handleSelectDueDatePreset(preset);
};

watch(
  () => state.value.response_due_date_time,
  (value) => {
    if (value === undefined) {
      useCustomDueTime.value = false;
      responseDueDateTimeInput.value = getDefaultDueDate();
      return;
    }

    const nextDueDate = new Date(value);
    if (Number.isNaN(nextDueDate.getTime())) return;

    useCustomDueTime.value = true;
    responseDueDateTimeInput.value = nextDueDate;
  },
);

watch(
  useCustomDueTime,
  (value) => {
    if (value) {
      state.value.response_due_date_time =
        responseDueDateTimeInput.value.toISOString();
    } else {
      state.value.response_due_date_time = undefined;
    }
  },
  { immediate: true },
);

watch(responseDueDateTimeInput, (value) => {
  if (!useCustomDueTime.value) return;
  state.value.response_due_date_time = value.toISOString();
});

watch(hasTargets, (value) => {
  if (!value) return;
  useCustomDueTime.value = true;
});

const dueHour = computed({
  get: () => responseDueDateTimeInput.value.getHours(),
  set: (h: number | null) => {
    if (h === null) return;
    const wrapped = ((h % 24) + 24) % 24;
    const newDate = new Date(responseDueDateTimeInput.value);
    newDate.setHours(wrapped, newDate.getMinutes(), 0, 0);
    responseDueDateTimeInput.value = newDate;
  },
});

const dueMinute = computed({
  get: () => responseDueDateTimeInput.value.getMinutes(),
  set: (m: number | null) => {
    if (m === null) return;
    const wrapped = ((m % 60) + 60) % 60;
    const newDate = new Date(responseDueDateTimeInput.value);
    newDate.setHours(newDate.getHours(), wrapped, 0, 0);
    responseDueDateTimeInput.value = newDate;
  },
});
</script>

<template>
  <div class="response-due-date-time-input">
    <div class="response-due-date-time-input-title">
      <p class="form-label">回答期限</p>
      <div class="due-date-mode-options">
        <label class="due-date-mode-option">
          <span>設定する</span>

          <ToggleSwitch v-model="useCustomDueTime" binary />
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
      :pt="{ timePicker: { style: 'display: none' } }"
    >
      <template #footer>
        <div class="custom-time-picker">
          <InputNumber
            v-model="dueHour"
            :step="1"
            show-buttons
            button-layout="vertical"
          />
          <span class="time-colon">:</span>
          <InputNumber
            v-model="dueMinute"
            :step="1"
            show-buttons
            button-layout="vertical"
          />
        </div>
      </template>
    </DatePicker>
    <ChipSelectRow
      v-if="useCustomDueTime"
      class="due-date-presets"
      :items="dueDatePresetChipItems"
      :selected-key="selectedDueDatePreset"
      @select="handleSelectDueDatePresetByValue"
    />
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
  gap: 20px;
  align-items: center;
}

.form-label {
  font-weight: bold;
}

.due-date-mode-options {
  display: flex;
  gap: 14px;
  align-items: center;
}

.due-date-mode-option {
  display: flex;
  gap: 6px;
  align-items: center;

  --p-toggleswitch-width: 2.15rem;
  --p-toggleswitch-height: 1.2rem;
  --p-toggleswitch-handle-size: 0.82rem;
}

.due-date-mode-option > span {
  font-size: 13px;
  font-weight: 500;
}

.custom-time-picker {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 4px;
  padding-block: 8px;

  :deep(.p-inputnumber-input) {
    width: 3rem;
    text-align: center;
    padding-inline: 0.25rem;
    z-index: 1;
  }
}

.time-colon {
  font-size: 1.1rem;
  font-weight: bold;
  line-height: 1;
}

.due-date-presets {
  margin-top: 2px;
}

.invalid-message {
  display: flex;
  align-items: center;
  gap: 4px;
  color: var(--p-red-500);
}
</style>
