<script lang="ts" setup>
import { onMounted } from 'vue';
import {
  responseViewableByOptionsMap,
  type GatewayResponseShareType,
} from '~/models/questionnaire';
import ResponseDueDateTimeInput from './response-due-date-time-input.vue';
import type { QuestionnaireFormSettings } from './type';
import UserSpecifierInput from './user-specifier-input.vue';

const state = defineModel<QuestionnaireFormSettings>({ required: true });
const isTitleFocused = ref(false);
const showTitleRequiredErrorAfterBlur = computed(
  () => state.value.title.trim() === '' && !isTitleFocused.value,
);
const showAdminRequiredError = computed(
  () =>
    state.value.admin.users.length === 0 &&
    state.value.admin.groups.length === 0,
);

onMounted(() => {
  document.getElementById('questionnaire-title-input')?.focus();
});

const responseViewableByOptions = Object.entries(
  responseViewableByOptionsMap,
).map(([value, label]) => ({
  label,
  value: value as GatewayResponseShareType,
}));
</script>

<template>
  <div class="questionnaire-metadata-input-container">
    <div class="questionnaire-title-input-container">
      <InputText
        id="questionnaire-title-input"
        v-model="state.title"
        :class="{ 'p-invalid': showTitleRequiredErrorAfterBlur }"
        size="large"
        required
        placeholder="タイトル (必須)"
        @focus="isTitleFocused = true"
        @blur="isTitleFocused = false"
      />
      <small v-if="showTitleRequiredErrorAfterBlur" class="invalid-message">
        <Icon name="mdi:alert-circle" size="20px" />
        <span>タイトルを入力してください</span>
      </small>
    </div>
    <Textarea v-model="state.description" placeholder="説明" auto-resize />
    <div class="form-elements">
      <div class="form-element">
        <p class="form-label">結果の公開範囲</p>
        <div class="radio-group">
          <label
            v-for="option in responseViewableByOptions"
            :key="option.value"
            class="radio-option"
            :for="`response-viewable-by-${option.value}`"
          >
            <RadioButton
              v-model="state.response_viewable_by"
              :input-id="`response-viewable-by-${option.value}`"
              name="response-viewable-by"
              :value="option.value"
            />
            <span>{{ option.label }}</span>
          </label>
        </div>
      </div>
      <ResponseDueDateTimeInput v-model="state" class="form-element" />
      <div class="form-element">
        <p class="form-label">対象者</p>
        <small>未回答の対象者は自動でリマインドされます</small>
        <UserSpecifierInput v-model="state.target" allow-all-mention-group />
      </div>
      <div class="form-element">
        <p class="form-label">管理者</p>
        <small>管理者はアンケートを編集できます</small>
        <UserSpecifierInput v-model="state.admin" />
        <small v-if="showAdminRequiredError" class="invalid-message">
          <Icon name="mdi:alert-circle" size="18px" />
          <span>アンケートの管理者を設定してください</span>
        </small>
      </div>
      <div class="form-element">
        <label class="form-bottom-switch" for="allow-duplicate">
          <Checkbox
            input-id="allow-duplicate"
            :value="state.is_duplicate_answer_allowed"
          />
          <p class="form-label">複数回答を許可</p>
        </label>
        <label class="form-element form-bottom-switch" for="is-anonymous">
          <Checkbox :value="state.is_anonymous" input-id="is-anonymous" />
          <p class="form-label">匿名回答</p>
        </label>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.questionnaire-metadata-input-container {
  display: flex;
  flex-direction: column;
  gap: 16px;
  border: 1px solid var(--p-surface-300);
  border-radius: var(--p-border-radius-md);
  padding: 16px;
}

.questionnaire-title-input-container {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.form-elements {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 32px 16px;
  margin-top: 16px;
}

@media screen and (max-width: variables.$breakpoint-lg) {
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

.radio-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.radio-option {
  display: flex;
  align-items: center;
  gap: 8px;
}

.invalid-message {
  display: flex;
  align-items: center;
  gap: 2px;
  color: var(--p-red-500);
}
</style>
