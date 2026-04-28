import { normalizeFilterSet, serializeFilterSet, tabFilterPresets } from './filter-domain';
import { buildSortQueryValue, getQueryValue, parseFilterSet, parseSortState } from './filter-query';
import { type SetQueryParamsOptions, setRouteQueryParams } from './filter-route';
import type { FilterKey, SortCategory, SortDirection, TabKey } from './filter-types';
import { explorerQueryKeys } from '~/composables/explorer/query-params';

export const useExplorerFilterUrlSync = () => {
  const router = useRouter();
  const route = useRoute();

  const filterSet = computed(() => parseFilterSet(route.query));

  const searchQuery = computed(() => getQueryValue(route.query[explorerQueryKeys.search]) ?? '');

  const sortState = computed(() => parseSortState(route.query));

  const setQueryParams = async (patch: Record<string, string | undefined>, options: SetQueryParamsOptions = {}) => {
    await setRouteQueryParams({
      router,
      route,
      patch,
      options,
    });
  };

  const setFilterSet = async (nextSet: Set<FilterKey>, options: SetQueryParamsOptions = {}) => {
    await setQueryParams(
      {
        [explorerQueryKeys.filter]: serializeFilterSet(normalizeFilterSet(nextSet)),
      },
      options,
    );
  };

  const setSortState = async (category: SortCategory, direction: SortDirection) => {
    await setQueryParams({
      [explorerQueryKeys.sort]: buildSortQueryValue(category, direction),
    });
  };

  const setSearchQuery = async (value: string) => {
    const normalized = value.trim();

    await setQueryParams({
      [explorerQueryKeys.search]: normalized || undefined,
      [explorerQueryKeys.page]: undefined,
    });
  };

  const setTab = async (tab: TabKey) => {
    await setFilterSet(new Set(tabFilterPresets[tab]));
  };

  return {
    filterSet,
    searchQuery,
    sortState,
    setFilterSet,
    setSearchQuery,
    setSortState,
    setTab,
  };
};
