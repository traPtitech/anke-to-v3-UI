<script lang="ts" setup>
import ExplorerFilterPanel from '~/components/explorer/explorer-filter-panel.vue';
import ExplorerLoadingSkeleton from '~/components/explorer/explorer-loading-skeleton.vue';
import { getQueryValue } from '~/components/explorer/filter-query';
import { setRouteQueryParams } from '~/components/explorer/filter-route';
import { toApiSort } from '~/components/explorer/filter-sort';
import type {
  ExplorerFilterPayload,
  TabKey,
} from '~/components/explorer/filter-types';
import {
  DEFAULT_SORT_CATEGORY,
  DEFAULT_SORT_DIRECTION,
} from '~/components/explorer/filter-types';
import QuestionnaireList from '~/components/ui/questionnaire-list/questionnaire-list.vue';
import {
  fetchQuestionnaires,
  type GetQuestionnairesOption,
} from '~/composables/type-fetch/anke-to/client';
import type { components } from '~/composables/type-fetch/anke-to/openapi';

type QuestionnaireSummary = components['schemas']['QuestionnaireSummary'];

const PAGE_SIZE = 20;
const route = useRoute();
const router = useRouter();

const setPageQuery = async (value: number) => {
  await setRouteQueryParams({
    router,
    route,
    patch: {
      page: value === 1 ? undefined : String(value),
    },
  });
};

const currentPage = computed<number>({
  get: () => {
    const rawPage = getQueryValue(route.query.page);
    const parsed = Number.parseInt(rawPage ?? '', 10);

    if (!Number.isFinite(parsed) || parsed < 1) {
      return 1;
    }

    return parsed;
  },
  set: (value) => {
    const normalized = Math.max(1, Math.floor(value));
    void setPageQuery(normalized);
  },
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

const apiQuery = computed<GetQuestionnairesOption>(() => {
  return {
    page: currentPage.value,
    ...activeFilterPayload.value.listQuery,
  };
});

const fetchQuestionnaireCount = async (option: GetQuestionnairesOption) => {
  const firstPage = await fetchQuestionnaires({
    ...option,
    page: 1,
  });

  const max = Math.max(1, firstPage.page_max ?? 1);
  if (max === 1) {
    return firstPage.questionnaires.length;
  }

  const lastPage = await fetchQuestionnaires({
    ...option,
    page: max,
  });

  return (max - 1) * PAGE_SIZE + lastPage.questionnaires.length;
};

const tabCountWatchKey = computed(() =>
  JSON.stringify(activeFilterPayload.value.tabCountQuery),
);

const { data: tabCounts } = useAsyncData(
  () =>
    `/questionnaires/explorer/tab-counts?${JSON.stringify(activeFilterPayload.value.tabCountQuery)}`,
  async () => {
    const base = activeFilterPayload.value.tabCountQuery;

    const [unanswered, all, answered, administered, draft] = await Promise.all([
      fetchQuestionnaireCount({
        ...base,
        onlyTargetingMe: true,
        hasMyResponse: false,
      }),
      fetchQuestionnaireCount({
        ...base,
      }),
      fetchQuestionnaireCount({
        ...base,
        hasMyResponse: true,
      }),
      fetchQuestionnaireCount({
        ...base,
        onlyAdministratedByMe: true,
      }),
      fetchQuestionnaireCount({
        ...base,
        hasMyDraft: true,
      }),
    ]);

    return {
      unanswered,
      all,
      answered,
      administered,
      draft,
    };
  },
  { watch: [tabCountWatchKey] },
);

const normalizedTabCounts = computed<Record<TabKey, number>>(() => ({
  unanswered: tabCounts.value?.unanswered ?? 0,
  all: tabCounts.value?.all ?? 0,
  answered: tabCounts.value?.answered ?? 0,
  administered: tabCounts.value?.administered ?? 0,
  draft: tabCounts.value?.draft ?? 0,
}));

const {
  data: questionnairePage,
  error,
  pending,
  refresh,
} = useAsyncData(
  () => `/questionnaires/explorer?${JSON.stringify(apiQuery.value)}`,
  () => fetchQuestionnaires(apiQuery.value),
  { watch: [apiQuery] },
);

const sortedQuestionnaires = computed<QuestionnaireSummary[]>(
  () => questionnairePage.value?.questionnaires ?? [],
);

const pageMax = computed(() =>
  Math.max(1, questionnairePage.value?.page_max ?? 1),
);

const totalRecordsForPaginator = computed(() => pageMax.value * PAGE_SIZE);

const handlePageChange = (event: { page: number }) => {
  currentPage.value = event.page + 1;
  window.scrollTo({ top: 0, behavior: 'auto' });
};

const handleRetry = () => {
  void refresh();
};

watch(
  () => activeFilterPayload.value.signature,
  () => {
    if (currentPage.value !== 1) {
      currentPage.value = 1;
    }
  },
);

watch(pageMax, (max) => {
  if (currentPage.value > max) {
    currentPage.value = max;
  }
});
</script>

<template>
  <div class="explorer-page">
    <ExplorerFilterPanel
      :tab-counts="normalizedTabCounts"
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
        :first="(currentPage - 1) * PAGE_SIZE"
        :rows="PAGE_SIZE"
        :total-records="totalRecordsForPaginator"
        template="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink"
        @page="handlePageChange"
      />

      <QuestionnaireList :questionnaires="sortedQuestionnaires" />

      <Paginator
        v-if="sortedQuestionnaires.length > 0"
        class="paginator"
        :first="(currentPage - 1) * PAGE_SIZE"
        :rows="PAGE_SIZE"
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
