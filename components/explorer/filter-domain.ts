import type {
  AdministrationScope,
  DraftScope,
  ExplorerAdvancedFilterState,
  ExplorerTabItem,
  FilterKey,
  ResponseScope,
  TabKey,
  TargetScope,
} from './filter-types';

export type FilterMeaning = {
  label: string;
  description: string;
};

export const filterKeys: FilterKey[] = [
  'targeting',
  'administered',
  'answered',
  'unanswered',
  'draft',
  'due',
  'unpublished',
];

export const filterMeanings: Record<FilterKey, FilterMeaning> = {
  targeting: {
    label: '自分が対象',
    description: '自分が対象のアンケートのみを表示します。',
  },
  administered: {
    label: '管理中',
    description: '自分が管理しているアンケートのみを表示します。',
  },
  answered: {
    label: '回答済み',
    description: '自分が回答済みのアンケートのみを表示します。',
  },
  unanswered: {
    label: '未回答',
    description: '自分が未回答のアンケートのみを表示します。',
  },
  draft: {
    label: '下書きあり',
    description: '自分の下書きがあるアンケートのみを表示します。',
  },
  due: {
    label: '期限内のみ',
    description: '期限が切れていないアンケートのみを表示します。',
  },
  unpublished: {
    label: '管理中 (下書き)',
    description:
      '自分が管理中のうち未公開 (下書き) のアンケートのみを表示します。',
  },
};

export const tabs: ExplorerTabItem[] = [
  { key: 'unanswered', label: '未回答' },
  { key: 'all', label: 'すべて' },
  { key: 'answered', label: '回答済み' },
  { key: 'administered', label: '管理中' },
  { key: 'draft', label: '下書き' },
];

export const tabFilterPresets: Record<TabKey, FilterKey[]> = {
  all: [],
  unanswered: ['targeting', 'unanswered'],
  answered: ['answered'],
  administered: ['administered'],
  draft: ['draft'],
};

const resolveResponseScope = (filters: Set<FilterKey>): ResponseScope => {
  if (filters.has('unanswered')) {
    return 'unanswered';
  }

  if (filters.has('answered')) {
    return 'answered';
  }

  return 'all';
};

const resolveAdministrationScope = (
  filters: Set<FilterKey>,
): AdministrationScope => {
  if (filters.has('unpublished')) {
    return 'draft';
  }

  if (filters.has('administered')) {
    return 'published';
  }

  return 'all';
};

const resolveTargetScope = (filters: Set<FilterKey>): TargetScope => {
  return filters.has('targeting') ? 'targetingMe' : 'all';
};

const resolveDraftScope = (filters: Set<FilterKey>): DraftScope => {
  return filters.has('draft') ? 'hasMyDraft' : 'all';
};

export const parseAdvancedFilterState = (
  filters: Set<FilterKey>,
): ExplorerAdvancedFilterState => {
  const responseScope = resolveResponseScope(filters);

  return {
    targetScope: resolveTargetScope(filters),
    responseScope,
    draftScope: resolveDraftScope(filters),
    administrationScope: resolveAdministrationScope(filters),
  };
};

export const buildFilterSetFromAdvancedState = (
  state: ExplorerAdvancedFilterState,
): Set<FilterKey> => {
  const next = new Set<FilterKey>();

  if (state.targetScope === 'targetingMe') {
    next.add('targeting');
  }

  if (state.responseScope === 'answered') {
    next.add('answered');
  }

  if (state.responseScope === 'unanswered') {
    next.add('unanswered');
  }

  if (state.draftScope === 'hasMyDraft') {
    next.add('draft');
  }

  if (state.administrationScope === 'published') {
    next.add('administered');
  }

  if (state.administrationScope === 'draft') {
    next.add('administered');
    next.add('unpublished');
  }

  return next;
};

export const normalizeAdvancedFilterSet = (
  filters: Set<FilterKey>,
): Set<FilterKey> => {
  return buildFilterSetFromAdvancedState(parseAdvancedFilterState(filters));
};

export const normalizeFilterSet = (rawSet: Set<FilterKey>): Set<FilterKey> => {
  const normalized = normalizeAdvancedFilterSet(rawSet);

  if (rawSet.has('due')) {
    normalized.add('due');
  }

  return normalized;
};

export const serializeFilterSet = (set: Set<FilterKey>): string | undefined => {
  if (set.size === 0) {
    return undefined;
  }

  return [...set].sort().join(',');
};

export const setFilterEnabled = ({
  filters,
  key,
  enabled,
}: {
  filters: Set<FilterKey>;
  key: FilterKey;
  enabled: boolean;
}): Set<FilterKey> => {
  const nextSet = new Set(filters);

  if (enabled) {
    nextSet.add(key);
  } else {
    nextSet.delete(key);
  }

  return normalizeFilterSet(nextSet);
};

export const applyAdvancedFilterState = ({
  currentFilters,
  nextState,
}: {
  currentFilters: Set<FilterKey>;
  nextState: ExplorerAdvancedFilterState;
}): Set<FilterKey> => {
  const nextSet = buildFilterSetFromAdvancedState(nextState);

  if (currentFilters.has('due')) {
    nextSet.add('due');
  }

  return normalizeFilterSet(nextSet);
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
