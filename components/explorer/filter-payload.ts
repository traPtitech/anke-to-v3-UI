import { parseAdvancedFilterState, serializeFilterSet } from './filter-domain';
import { toApiSort } from './filter-sort';
import type {
  ExplorerFilterPayload,
  FilterKey,
  SortCategory,
  SortDirection,
} from './filter-types';

export const buildListQuery = ({
  searchQuery,
  filters,
  sortCategory,
  sortDirection,
}: {
  searchQuery: string;
  filters: Set<FilterKey>;
  sortCategory: SortCategory;
  sortDirection: SortDirection;
}): ExplorerFilterPayload['listQuery'] => {
  const trimmedSearch = searchQuery.trim();
  const advancedFilter = parseAdvancedFilterState(filters);
  const responseScope = advancedFilter.responseScope;
  const administrationScope = advancedFilter.administrationScope;

  return {
    search: trimmedSearch || undefined,
    sort: toApiSort(sortCategory, sortDirection),
    onlyTargetingMe:
      advancedFilter.targetScope === 'targetingMe' ? true : undefined,
    onlyAdministratedByMe: administrationScope !== 'all' ? true : undefined,
    notOverDue: filters.has('due') ? true : undefined,
    hasMyResponse:
      responseScope === 'answered'
        ? true
        : responseScope === 'unanswered'
          ? false
          : undefined,
    hasMyDraft: advancedFilter.draftScope === 'hasMyDraft' ? true : undefined,
    isDraft:
      administrationScope === 'draft'
        ? true
        : administrationScope === 'published' || responseScope === 'unanswered'
          ? false
          : undefined,
  };
};

export const buildTabCountQuery = ({
  searchQuery,
  filters,
}: {
  searchQuery: string;
  filters: Set<FilterKey>;
}): ExplorerFilterPayload['tabCountQuery'] => {
  const trimmedSearch = searchQuery.trim();

  return {
    search: trimmedSearch || undefined,
    notOverDue: filters.has('due') ? true : undefined,
  };
};

export const buildFilterSignature = ({
  filters,
  searchQuery,
  sortCategory,
  sortDirection,
}: {
  filters: Set<FilterKey>;
  searchQuery: string;
  sortCategory: SortCategory;
  sortDirection: SortDirection;
}): string => {
  return JSON.stringify({
    filter: serializeFilterSet(filters) ?? '',
    search: searchQuery.trim(),
    sort: `${sortCategory}:${sortDirection}`,
  });
};
