<script lang="ts" setup>
import {
  responseViewableByOptionsMap,
  type GatewayResponseShareType,
} from '~/models/questionnaire';
import ResponseDueDateTimeInput from './response-due-date-time-input.vue';
import type { QuestionnaireFormSettings } from './type';
import UserSpecifierInput from './user-specifier-input.vue';

const state = defineModel<QuestionnaireFormSettings>({ required: true });

const responseViewableByOptions = Object.entries(
  responseViewableByOptionsMap,
).map(([value, label]) => ({
  label,
  value: value as GatewayResponseShareType,
}));
</script>

<template>
  <div class="questionnaire-metadata-input-container">
    <InputText
      v-model="state.title"
      size="large"
      required
      placeholder="アンケートのタイトル (必須)"
    />
    <Textarea
      v-model="state.description"
      placeholder="アンケートの説明"
      auto-resize
    />
    <div class="form-elements">
      <div class="form-element">
        <p class="form-label">結果の公開範囲</p>
        <Dropdown
          v-model="state.response_viewable_by"
          :options="responseViewableByOptions"
          option-label="label"
          option-value="value"
          scroll-height="320px"
        />
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
      </div>
      <div class="form-element form-bottom-switch">
        <p class="form-label">1人が複数回答できるか</p>
        <InputSwitch v-model="state.is_duplicate_answer_allowed" />
      </div>
      <div class="form-element form-bottom-switch">
        <p class="form-label">回答を匿名にするか</p>
        <InputSwitch v-model="state.is_anonymous" />
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

.invalid-message {
  color: #f26451;
}
</style>
