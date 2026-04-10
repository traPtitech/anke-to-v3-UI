import type {
  AdministrationScope,
  DraftScope,
  ExplorerAdvancedFilterState,
  FilterKey,
  ResponseScope,
  TargetScope,
} from './filter-types';

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

const resolveTargetScope = (
  filters: Set<FilterKey>,
  responseScope: ResponseScope,
): TargetScope => {
  if (responseScope === 'unanswered') {
    return 'targetingMe';
  }

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
    targetScope: resolveTargetScope(filters, responseScope),
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
    next.add('targeting');
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
