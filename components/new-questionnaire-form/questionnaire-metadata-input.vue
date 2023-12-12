<script lang="ts" setup>
const props = defineProps<{
  modelValue: QuestionnaireFormSettings;
  isResponseDueDateTimeInvalidForTargets: boolean;
  isResponseDueDateTimeInvalidForDate: boolean;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: QuestionnaireFormSettings): void;
}>();

const state = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
});

const responseViewableByOptions = [
  {
    label: '全体',
    value: 'anyone',
  },
  {
    label: '回答した人のみ',
    value: 'respondents',
  },
  {
    label: '管理者のみ',
    value: 'admins',
  },
] satisfies {
  label: string;
  value: QuestionnaireFormSettings['responseViewableBy'];
}[];

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

const responseDueDateTimeDropdown = ref<ResponseDueDateTimeOption>('no-due');
const responseDueDateTimeInput = ref<Date>(addDays(today, 7));
const responseDueDateTimeInputDisabled = computed(() => {
  return responseDueDateTimeDropdown.value !== 'custom';
});

watch(
  responseDueDateTimeDropdown,
  (value) => {
    switch (value) {
      case 'no-due':
        state.value.responseDueDateTime = null;
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
        state.value.responseDueDateTime =
          responseDueDateTimeInput.value.toISOString();
        break;
    }
  },
  { immediate: true },
);

watch(
  responseDueDateTimeInput,
  (value) => (state.value.responseDueDateTime = value.toISOString()),
);
</script>

<template>
  <div class="questionnaire-metadata-input-container">
    <InputText
      v-model="state.title"
      size="large"
      required
      placeholder="アンケートのタイトル"
    />
    <Textarea v-model="state.description" placeholder="アンケートの説明" />
    <div class="form-elements">
      <div class="form-element">
        <p class="form-label">結果の公開範囲</p>
        <Dropdown
          v-model="state.responseViewableBy"
          :options="responseViewableByOptions"
          option-label="label"
          option-value="value"
          scroll-height="320px"
        />
      </div>
      <div class="form-element">
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
          対象者を設定する場合「期限なし」にすることはできません
        </small>
        <small
          v-if="isResponseDueDateTimeInvalidForDate"
          class="invalid-message"
        >
          過去の日時を設定することはできません
        </small>
      </div>
      <div class="form-element">
        <p class="form-label">対象者</p>
        <small>未回答の対象者は自動でリマインドされます</small>
        <UserSpecifierInput v-model="state.targets" />
      </div>
      <div class="form-element">
        <p class="form-label">管理者</p>
        <small>管理者はアンケートを編集できます</small>
        <UserSpecifierInput v-model="state.admins" />
      </div>
      <div class="form-element form-bottom-switch">
        <p class="form-label">1人が複数回答できるか</p>
        <InputSwitch v-model="state.isAllowingMultipleResponses" />
      </div>
      <div class="form-element form-bottom-switch">
        <p class="form-label">回答を匿名にするか</p>
        <InputSwitch v-model="state.isAnonymous" />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.questionnaire-metadata-input-container {
  display: flex;
  flex-direction: column;
  gap: 16px;
  border: 1px solid var(--surface-d);
  border-radius: var(--border-radius);
  padding: 16px;
}

.form-elements {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 32px 16px;
  margin-top: 16px;
}

@media screen and (max-width: $breakpoint-lg) {
  .form-elements {
    grid-template-columns: 1fr;
  }
}

.form-element {
  display: flex;
  flex-direction: column;
  gap: 8px;
  min-width: 0;
}

.form-bottom-switch {
  display: flex;
  flex-direction: row;
  gap: 16px;
  align-items: center;
}

.form-label {
  font-weight: bold;
}

.invalid-message {
  color: #f26451;
}
</style>
