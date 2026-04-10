import { describe, expect, it } from 'vitest';
import {
  applyAdvancedFilterState,
  buildFilterSetFromAdvancedState,
  filterKeys,
  filterMeanings,
  findSelectedTab,
  normalizeFilterSet,
  parseAdvancedFilterState,
  serializeFilterSet,
  setFilterEnabled,
} from './filter-domain';
import type { ExplorerAdvancedFilterState, FilterKey } from './filter-types';

const toSortedArray = (set: Set<FilterKey>) => [...set].sort();

describe('filter-domain core state', () => {
  it('parses advanced state with precedence rules', () => {
    const state = parseAdvancedFilterState(
      new Set<FilterKey>(['answered', 'unanswered', 'draft', 'unpublished']),
    );

    expect(state).toEqual({
      targetScope: 'all',
      responseScope: 'unanswered',
      draftScope: 'hasMyDraft',
      administrationScope: 'draft',
    });
  });

  it('builds filter set from advanced state', () => {
    const state: ExplorerAdvancedFilterState = {
      targetScope: 'targetingMe',
      responseScope: 'answered',
      draftScope: 'all',
      administrationScope: 'published',
    };

    expect(toSortedArray(buildFilterSetFromAdvancedState(state))).toEqual([
      'administered',
      'answered',
      'targeting',
    ]);
  });

  it('normalizes filter set and preserves due filter', () => {
    const normalized = normalizeFilterSet(
      new Set<FilterKey>(['answered', 'unanswered', 'due', 'unpublished']),
    );

    expect(toSortedArray(normalized)).toEqual([
      'administered',
      'due',
      'unanswered',
      'unpublished',
    ]);
  });

  it('updates individual filters through state operation', () => {
    const next = setFilterEnabled({
      filters: new Set<FilterKey>(['answered']),
      key: 'unanswered',
      enabled: true,
    });

    expect(toSortedArray(next)).toEqual(['unanswered']);
  });

  it('applies advanced filter state while keeping due', () => {
    const next = applyAdvancedFilterState({
      currentFilters: new Set<FilterKey>(['due', 'answered']),
      nextState: {
        targetScope: 'all',
        responseScope: 'all',
        draftScope: 'all',
        administrationScope: 'all',
      },
    });

    expect(toSortedArray(next)).toEqual(['due']);
  });

  it('resolves selected tab from normalized filters', () => {
    expect(
      findSelectedTab(new Set<FilterKey>(['targeting', 'unanswered'])),
    ).toBe('unanswered');
    expect(
      findSelectedTab(new Set<FilterKey>(['targeting', 'unanswered', 'due'])),
    ).toBeNull();
  });

  it('keeps filter meaning metadata in sync with filter keys', () => {
    expect(Object.keys(filterMeanings).sort()).toEqual([...filterKeys].sort());
  });

  it('serializes filter set deterministically', () => {
    expect(serializeFilterSet(new Set<FilterKey>(['targeting', 'due']))).toBe(
      'due,targeting',
    );
  });
});
