import { getQueryValue } from '~/components/explorer/filter-query';
import { setRouteQueryParams } from '~/components/explorer/filter-route';
import type { ExplorerFilterPayload } from '~/components/explorer/filter-types';
import { explorerQueryKeys } from './query-params';
import {
  fetchQuestionnaires,
  type GetQuestionnairesOption,
} from '~/composables/type-fetch/anke-to/client';

export const EXPLORER_PAGE_SIZE = 20;

export const useExplorerQuestionnaires = ({
  activeFilterPayload,
}: {
  activeFilterPayload: Ref<ExplorerFilterPayload>;
}) => {
  const route = useRoute();
  const router = useRouter();

  const setPageQuery = async (value: number) => {
    await setRouteQueryParams({
      router,
      route,
      patch: {
        [explorerQueryKeys.page]: value === 1 ? undefined : String(value),
      },
    });
  };

  const currentPage = computed<number>({
    get: () => {
      const rawPage = getQueryValue(route.query[explorerQueryKeys.page]);
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

  const apiQuery = computed<GetQuestionnairesOption>(() => {
    return {
      page: currentPage.value,
      ...activeFilterPayload.value.listQuery,
    };
  });

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

  const pageMax = computed(() =>
    Math.max(1, questionnairePage.value?.page_max ?? 1),
  );

  const totalRecordsForPaginator = computed(
    () => pageMax.value * EXPLORER_PAGE_SIZE,
  );

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

  return {
    currentPage,
    questionnairePage,
    error,
    pending,
    pageMax,
    totalRecordsForPaginator,
    handlePageChange,
    handleRetry,
  };
};
