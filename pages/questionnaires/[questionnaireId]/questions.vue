<script setup lang="ts">
import ButtonLink from '~/components/ui/button-link.vue';
import MarkdownBlock from '~/components/ui/markdown/markdown-block.vue';
import DetailLoadingIndicator from '~/components/ui/page-state/detail-loading-indicator.vue';
import ErrorStatePanel from '~/components/ui/page-state/error-state-panel.vue';
import { usePageSeo } from '~/composables/use-page-seo';
import { useGetQuestionnaire } from '~/composables/type-fetch/anke-to/client';
import type { GatewayQuestion } from '~/models/question';

const questionnaireId = useRouteQuestionnaireId();
const { data, error, refresh } = useGetQuestionnaire(questionnaireId);

usePageSeo({
  title: computed(() => (data.value ? `「${data.value.title}」の質問一覧` : '読み込み中...')),
  description: 'アンケートに含まれる質問を一覧で確認できます。',
});

const questionTypeLabelMap = {
  Text: '短文',
  TextLong: '長文',
  Number: '数値',
  SingleChoice: '単一選択',
  MultipleChoice: '複数選択',
  Scale: '評価',
} as const;

const getQuestionTypeLabel = (question: GatewayQuestion) => questionTypeLabelMap[question.question_type];

const handleRetry = async () => {
  await refresh();
};
</script>

<template>
  <div class="question-list-page-state">
    <ErrorStatePanel
      v-if="error"
      title="質問一覧の取得に失敗しました"
      :message="error.message"
      :show-retry="true"
      @retry="handleRetry"
    />
    <DetailLoadingIndicator v-else-if="data === undefined" variant="questionnaire" />
    <div v-else class="question-list-page">
      <div class="question-list-nav">
        <ButtonLink variant="secondary" size="sm" :to="`/questionnaires/${data.questionnaire_id}`">
          <Icon name="mdi:chevron-left" size="20px" />
          <span>アンケート詳細に戻る</span>
        </ButtonLink>
      </div>

      <header class="question-list-header">
        <h1 class="question-list-title">質問一覧</h1>
        <p class="question-list-subtitle">
          {{ data.title }}
        </p>
      </header>

      <div v-if="data.questions.length === 0" class="question-list-empty">質問がありません</div>
      <ol v-else class="question-list">
        <li v-for="(question, index) in data.questions" :key="question.question_id" class="question-item">
          <div class="question-item-head">
            <span class="question-index">{{ index + 1 }}.</span>
            <h2 class="question-title">{{ question.title }}</h2>
            <span class="question-type-chip">
              {{ getQuestionTypeLabel(question) }}
            </span>
            <span
              class="question-required-chip"
              :class="{
                'question-required-chip-optional': !question.is_required,
              }"
            >
              {{ question.is_required ? '必須' : '任意' }}
            </span>
          </div>

          <MarkdownBlock :content="question.description" class="question-description" />

          <ul
            v-if="question.question_type === 'SingleChoice' || question.question_type === 'MultipleChoice'"
            class="question-options"
          >
            <li v-for="option in question.options" :key="option">
              {{ option }}
            </li>
          </ul>

          <div v-if="question.question_type === 'Number'" class="question-meta">
            <span>最小値: {{ question.min_value ?? '指定なし' }}</span>
            <span>最大値: {{ question.max_value ?? '指定なし' }}</span>
          </div>

          <div v-if="question.question_type === 'Scale'" class="question-meta">
            <span>{{ question.min_value }} ({{ question.min_label }})</span>
            <span>{{ question.max_value }} ({{ question.max_label }})</span>
          </div>
        </li>
      </ol>
    </div>
  </div>
</template>

<style scoped lang="scss">
.question-list-page-state {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.question-list-page {
  width: 100%;
  max-width: 960px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 18px;
  padding-bottom: 24px;
}

.question-list-nav {
  display: flex;
  align-items: center;
}

.question-list-header {
  border: 1px solid var(--p-surface-200);
  border-radius: 10px;
  background: var(--p-surface-0);
  padding: 18px 20px;
}

.question-list-title {
  margin: 0;
  font-size: 24px;
  line-height: 1.3;
}

.question-list-subtitle {
  margin: 6px 0 0;
  color: var(--p-text-muted-color);
}

.question-list-empty {
  border: 1px solid var(--p-surface-200);
  border-radius: 10px;
  padding: 16px;
  color: var(--p-text-muted-color);
  background: var(--p-surface-0);
}

.question-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.question-item {
  border: 1px solid var(--p-surface-200);
  border-radius: 10px;
  padding: 16px 18px;
  background: var(--p-surface-0);
}

.question-item-head {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.question-index {
  font-weight: 700;
}

.question-title {
  margin: 0;
  font-size: 17px;
  line-height: 1.4;
}

.question-type-chip,
.question-required-chip {
  display: inline-flex;
  align-items: center;
  border-radius: 999px;
  padding: 2px 10px;
  font-size: 12px;
  font-weight: 700;
}

.question-type-chip {
  background: var(--p-surface-100);
  color: var(--p-text-secondary);
}

.question-required-chip {
  background: hsl(0, 62%, 50%);
  color: #fff;
}

.question-required-chip-optional {
  background: var(--p-surface-200);
  color: var(--p-text-muted-color);
}

.question-description {
  margin-top: 10px;
  color: var(--p-text-muted-color);
}

.question-options {
  margin: 10px 0 0;
  padding-left: 18px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.question-meta {
  margin-top: 10px;
  display: flex;
  gap: 14px;
  color: var(--p-text-muted-color);
  font-size: 13px;
  flex-wrap: wrap;
}

@media screen and (max-width: 640px) {
  .question-list-header {
    padding: 14px;
  }

  .question-list-title {
    font-size: 20px;
  }

  .question-item {
    padding: 14px;
  }
}
</style>
