import { serializeFilterSet } from './filter-query';
import { toApiSort } from './filter-sort';
import type {
  ExplorerFilterPayload,
  FilterKey,
  SortCategory,
  SortDirection,
} from './filter-types';

const hasFilter = (filters: Set<FilterKey>, key: FilterKey): boolean => {
  return filters.has(key);
};

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

  return {
    search: trimmedSearch || undefined,
    sort: toApiSort(sortCategory, sortDirection),
    onlyTargetingMe:
      hasFilter(filters, 'targeting') || hasFilter(filters, 'unanswered')
        ? true
        : undefined,
    onlyAdministratedByMe: hasFilter(filters, 'administered')
      ? true
      : undefined,
    notOverDue:
      hasFilter(filters, 'due') || hasFilter(filters, 'unanswered')
        ? true
        : undefined,
    hasMyResponse: hasFilter(filters, 'answered')
      ? true
      : hasFilter(filters, 'unanswered')
        ? false
        : undefined,
    hasMyDraft: hasFilter(filters, 'draft') ? true : undefined,
    isDraft: hasFilter(filters, 'unpublished')
      ? true
      : hasFilter(filters, 'unanswered')
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
    notOverDue: hasFilter(filters, 'due') ? true : undefined,
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
