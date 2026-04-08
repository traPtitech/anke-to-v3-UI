<script lang="ts" setup>
import ExplorerFilterPanel from '~/components/explorer/explorer-filter-panel.vue';
import ExplorerLoadingSkeleton from '~/components/explorer/explorer-loading-skeleton.vue';
import { toApiSort } from '~/components/explorer/filter-sort';
import type { ExplorerFilterPayload } from '~/components/explorer/filter-types';
import {
  DEFAULT_SORT_CATEGORY,
  DEFAULT_SORT_DIRECTION,
} from '~/components/explorer/filter-types';
import QuestionnaireList from '~/components/ui/questionnaire-list/questionnaire-list.vue';
import {
  EXPLORER_PAGE_SIZE,
  useExplorerQuestionnaires,
} from '~/composables/explorer/use-explorer-questionnaires';
import { useExplorerTabCounts } from '~/composables/explorer/use-explorer-tab-counts';
import type { components } from '~/composables/type-fetch/anke-to/openapi';

type QuestionnaireSummary = components['schemas']['QuestionnaireSummary'];

useSeoMeta({
  title: 'アンケート一覧',
  description: '公開中・回答済み・管理中などの条件でアンケートを検索できます。',
});

const activeFilterPayload = ref<ExplorerFilterPayload>({
  signature: 'initial',
  listQuery: {
    sort: toApiSort(DEFAULT_SORT_CATEGORY, DEFAULT_SORT_DIRECTION),
  },
  tabCountQuery: {},
});

const handleFilterChange = (payload: ExplorerFilterPayload) => {
  activeFilterPayload.value = payload;
};

const {
  currentPage,
  questionnairePage,
  error,
  pending,
  totalRecordsForPaginator,
  handlePageChange,
  handleRetry,
} = useExplorerQuestionnaires({
  activeFilterPayload,
});

const { normalizedTabCounts, tabCountsLoading } = useExplorerTabCounts({
  activeFilterPayload,
});

const sortedQuestionnaires = computed<QuestionnaireSummary[]>(
  () => questionnairePage.value?.questionnaires ?? [],
);
</script>

<template>
  <div class="explorer-page">
    <ExplorerFilterPanel
      :tab-counts="normalizedTabCounts"
      :tab-counts-loading="tabCountsLoading"
      @change="handleFilterChange"
    />

    <div v-if="error" class="state-box is-error">
      <p>アンケート一覧の取得に失敗しました</p>
      <Button class="state-box-retry" severity="secondary" @click="handleRetry">
        <Icon name="mdi:refresh" size="16px" />
        <span>再読み込み</span>
      </Button>
    </div>

    <ExplorerLoadingSkeleton v-else-if="pending && !questionnairePage" />

    <template v-else-if="sortedQuestionnaires.length === 0">
      <div class="state-box">
        <p>条件に一致するアンケートはありません</p>
      </div>
    </template>

    <template v-else>
      <Paginator
        v-if="sortedQuestionnaires.length > 0"
        :first="(currentPage - 1) * EXPLORER_PAGE_SIZE"
        :rows="EXPLORER_PAGE_SIZE"
        :total-records="totalRecordsForPaginator"
        template="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink"
        @page="handlePageChange"
      />

      <QuestionnaireList :questionnaires="sortedQuestionnaires" />

      <Paginator
        v-if="sortedQuestionnaires.length > 0"
        class="paginator"
        :first="(currentPage - 1) * EXPLORER_PAGE_SIZE"
        :rows="EXPLORER_PAGE_SIZE"
        :total-records="totalRecordsForPaginator"
        template="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink"
        @page="handlePageChange"
      />
    </template>
  </div>
</template>

<style scoped lang="scss">
.explorer-page {
  width: 100%;
  max-width: 1080px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.state-box {
  border: 1px solid var(--p-surface-300);
  border-radius: var(--p-border-radius-md);
  padding: 20px;
  text-align: center;
  color: var(--p-text-secondary);
  background-color: var(--p-surface-0);
}

.state-box.is-error {
  border-color: var(--p-red-300);
  color: var(--p-red-700);
}

.state-box-retry {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  margin-top: 8px;
}
</style>
