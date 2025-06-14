<script lang="ts" setup>
import type { QuestionnaireDetail, ResShareType } from './type';

const props = defineProps<{ detail: QuestionnaireDetail }>();

const responseViewableByLabels = {
  anyone: '全員',
  respondents: '回答者のみ',
  admins: '管理者のみ',
} satisfies Record<ResShareType, string>;

const nonAnsweredTargets = computed(() =>
  props.detail.targets.filter(
    (user) => !props.detail.respondents.includes(user),
  ),
);
</script>

<template>
  <div class="questionnaire-detail-container">
    <div class="questionnaire-detail-title">
      <h1>{{ detail.title }}</h1>
      <div>{{ detail.description }}</div>
    </div>
    <div class="questionnaire-detail-element-container">
      <div class="questionnaire-detail-element">
        <div class="questionnaire-detail-element-label">回答期限</div>
        <div v-if="detail.response_due_date_time !== undefined">
          {{ formatRelativeDate(new Date(detail.response_due_date_time)) }}
          ({{ formatDate(new Date(detail.response_due_date_time)) }})
        </div>
        <div v-else>期限なし</div>
      </div>
      <div class="questionnaire-detail-element">
        <div class="questionnaire-detail-element-label">回答の公開範囲</div>
        <div>
          {{ responseViewableByLabels[detail.response_viewable_by] }}
        </div>
      </div>
      <div class="questionnaire-detail-element">
        <div class="questionnaire-detail-element-label">匿名回答かどうか</div>
        <div>
          {{ detail.is_anonymous ? '匿名' : '匿名ではない' }}
        </div>
      </div>
      <div
        v-if="detail.is_duplicate_answer_allowed"
        class="questionnaire-detail-element"
      >
        <div class="questionnaire-detail-element-label">
          1人が複数回答できるか
        </div>
        <div>
          {{ detail.is_duplicate_answer_allowed ? '複数回答可' : '1回のみ' }}
        </div>
      </div>
    </div>

    <QuestionnaireActions :detail="detail" />

    <div
      class="questionnaire-detail-element-container questionnaire-target-container"
    >
      <div class="questionnaire-detail-element">
        <div class="questionnaire-detail-element-label">対象者</div>
        <UserAndGroupList
          :specifier="detail.target"
          :actual-users="detail.targets"
        />
      </div>
      <div class="questionnaire-target-result">
        <div class="questionnaire-detail-element">
          <div class="questionnaire-detail-element-label">回答した人</div>
          <UserList :users="detail.respondents" />
        </div>
        <div class="questionnaire-detail-element">
          <div class="questionnaire-detail-element-label">
            まだ回答してない人
          </div>
          <UserList :users="nonAnsweredTargets" />
        </div>
      </div>
    </div>

    <div class="questionnaire-detail-element-container">
      <div class="questionnaire-detail-element">
        <div class="questionnaire-detail-element-label">管理者</div>
        <UserAndGroupList
          :specifier="detail.admin"
          :actual-users="detail.admins"
        />
      </div>
      <div class="questionnaire-detail-element">
        <div class="questionnaire-detail-element-label">最終更新日時</div>
        <div>
          {{ formatRelativeDate(new Date(detail.modified_at)) }}
          ({{ formatDate(new Date(detail.modified_at)) }})
        </div>
      </div>
      <div class="questionnaire-detail-element">
        <div class="questionnaire-detail-element-label">作成日時</div>
        <div>
          {{ formatRelativeDate(new Date(detail.created_at)) }}
          ({{ formatDate(new Date(detail.created_at)) }})
        </div>
      </div>
    </div>

    <QuestionnaireAdminActions :detail="detail" />
  </div>
</template>

<style lang="scss">
.questionnaire-detail-container {
  max-width: 1080px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 16px;
  container-type: inline-size;
  padding-bottom: 50vh;
}

.questionnaire-detail-title {
  padding: 32px;
  border: 1px solid var(--p-surface-300);
  border-radius: var(--p-border-radius-md);
  min-height: 160px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.questionnaire-detail-element-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  padding: 32px;
  border: 1px solid var(--p-surface-300);
  border-radius: var(--p-border-radius-md);
}

.questionnaire-detail-element {
}

.questionnaire-detail-element-label {
  font-weight: bold;
  font-size: 14px;
}

.questionnaire-target-result {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

@media screen and (max-width: $breakpoint-lg) {
  .questionnaire-target-container {
    grid-template-columns: 1fr;
  }
}

@media screen and (max-width: $breakpoint-md) {
  .questionnaire-detail-element-container {
    grid-template-columns: 1fr;
  }
}

@media screen and (max-width: $breakpoint-sm) {
  .questionnaire-detail-element-container {
    padding: 16px;
  }
}
</style>
