import {
  filterKeys,
  normalizeFilterSet,
  serializeFilterSet,
  tabFilterPresets,
} from './filter-domain';
import { isSortCategory } from './filter-sort';
import {
  DEFAULT_SORT_CATEGORY,
  DEFAULT_SORT_DIRECTION,
  type FilterKey,
  type SortCategory,
  type SortDirection,
  type TabKey,
} from './filter-types';
import { explorerQueryKeys } from '~/composables/explorer/query-params';

const filterKeySet = new Set<string>(filterKeys);

const isFilterKey = (value: string): value is FilterKey => {
  return filterKeySet.has(value);
};

export const getQueryValue = (value: unknown): string | undefined => {
  if (Array.isArray(value)) {
    const first = value[0];
    return typeof first === 'string' ? first : undefined;
  }

  return typeof value === 'string' ? value : undefined;
};

export const parseFilterSet = (
  query: Record<string, unknown>,
): Set<FilterKey> => {
  const raw = getQueryValue(query[explorerQueryKeys.filter]);
  const set = new Set<FilterKey>();

  if (raw) {
    raw
      .split(',')
      .map((item) => item.trim())
      .filter((item): item is FilterKey => isFilterKey(item))
      .forEach((item) => set.add(item));
  }

  return normalizeFilterSet(set);
};

export const buildTabFilterQuery = (tab: TabKey): string | undefined => {
  return serializeFilterSet(new Set(tabFilterPresets[tab]));
};

const isSortDirection = (value: string): value is SortDirection => {
  return value === 'asc' || value === 'desc';
};

const parseSortToken = (
  token: string,
): { category: SortCategory; direction: SortDirection } | null => {
  const parts = token.split(':');
  if (parts.length !== 2) {
    return null;
  }

  const [category, direction] = parts;

  if (!isSortCategory(category) || !isSortDirection(direction)) {
    return null;
  }

  return {
    category,
    direction,
  };
};

export const parseSortState = (
  query: Record<string, unknown>,
): {
  category: SortCategory;
  direction: SortDirection;
} => {
  const rawSort = getQueryValue(query[explorerQueryKeys.sort]);
  if (!rawSort) {
    return {
      category: DEFAULT_SORT_CATEGORY,
      direction: DEFAULT_SORT_DIRECTION,
    };
  }

  const parsed = parseSortToken(rawSort.trim());
  if (!parsed) {
    return {
      category: DEFAULT_SORT_CATEGORY,
      direction: DEFAULT_SORT_DIRECTION,
    };
  }

  return parsed;
};

export const buildSortQueryValue = (
  category: SortCategory,
  direction: SortDirection,
): string => {
  return `${category}:${direction}`;
};
