import { normalizeAdvancedFilterSet } from './filter-domain';
import type { ExplorerTabItem, FilterKey, TabKey } from './filter-types';
import {
  explorerLegacyFilterQueryKeys,
  explorerQueryKeys,
} from '~/composables/explorer/query-params';

export const tabs: ExplorerTabItem[] = [
  { key: 'unanswered', label: '未回答' },
  { key: 'all', label: 'すべて' },
  { key: 'answered', label: '回答済み' },
  { key: 'administered', label: '管理中' },
  { key: 'draft', label: '下書き' },
];

export const filterKeys: FilterKey[] = [
  'targeting',
  'administered',
  'answered',
  'unanswered',
  'draft',
  'due',
  'unpublished',
];

export const legacyFilterQueryKeys = [...explorerLegacyFilterQueryKeys];

const isFilterKey = (value: string): value is FilterKey => {
  return (
    value === 'targeting' ||
    value === 'administered' ||
    value === 'answered' ||
    value === 'unanswered' ||
    value === 'draft' ||
    value === 'due' ||
    value === 'unpublished'
  );
};

export const tabFilterPresets: Record<TabKey, FilterKey[]> = {
  all: [],
  unanswered: ['targeting', 'unanswered'],
  answered: ['answered'],
  administered: ['administered'],
  draft: ['draft'],
};

const hashTabMap: Record<string, TabKey> = {
  all: 'all',
  unanswered: 'unanswered',
  answered: 'answered',
  administered: 'administered',
  admin: 'administered',
  draft: 'draft',
};

export const getQueryValue = (value: unknown): string | undefined => {
  if (Array.isArray(value)) {
    const first = value[0];
    return typeof first === 'string' ? first : undefined;
  }

  return typeof value === 'string' ? value : undefined;
};

export const normalizeFilterSet = (rawSet: Set<FilterKey>): Set<FilterKey> => {
  const normalized = normalizeAdvancedFilterSet(rawSet);

  if (rawSet.has('due')) {
    normalized.add('due');
  }

  return normalized;
};

const parseLegacyFilterSet = (
  query: Record<string, unknown>,
): Set<FilterKey> => {
  const set = new Set<FilterKey>();

  if (getQueryValue(query.targeting) === '1') set.add('targeting');
  if (getQueryValue(query.admin) === '1') set.add('administered');
  if (getQueryValue(query.answered) === '1') set.add('answered');
  if (getQueryValue(query.unanswered) === '1') set.add('unanswered');
  if (getQueryValue(query.draft) === '1') set.add('draft');
  if (getQueryValue(query.due) === '1') set.add('due');
  if (getQueryValue(query.unpublished) === '1') set.add('unpublished');
  if (getQueryValue(query.onlyTargetingMe) === 'true') set.add('targeting');
  if (getQueryValue(query.isDraft) === 'true') set.add('draft');

  return set;
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

  if (set.size === 0) {
    parseLegacyFilterSet(query).forEach((item) => set.add(item));
  }

  return normalizeFilterSet(set);
};

export const serializeFilterSet = (set: Set<FilterKey>): string | undefined => {
  if (set.size === 0) {
    return undefined;
  }

  return [...set].sort().join(',');
};

export const resolveTabFromHash = (hash: string): TabKey | null => {
  const normalized = decodeURIComponent(hash.replace(/^#/, ''))
    .trim()
    .toLowerCase();

  return hashTabMap[normalized] ?? null;
};

export const findSelectedTab = (set: Set<FilterKey>): TabKey | null => {
  const current = [...set].sort().join(',');

  for (const tab of tabs) {
    const preset = tabFilterPresets[tab.key];
    if ([...preset].sort().join(',') === current) {
      return tab.key;
    }
  }

  return null;
};

export const buildTabFilterQuery = (tab: TabKey): string | undefined => {
  return serializeFilterSet(new Set(tabFilterPresets[tab]));
};
