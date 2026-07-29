import { describe, expect, it } from 'vitest';
import { buildListQuery, buildTabCountQuery } from './filter-payload';
import type { FilterKey } from './filter-types';

describe('filter-payload query builder', () => {
  it('applies notOverDue in list query only when due filter is enabled', () => {
    const withDue = buildListQuery({
      searchQuery: '',
      filters: new Set<FilterKey>(['targeting', 'unanswered', 'due']),
      sortCategory: 'createdAt',
      sortDirection: 'desc',
    });

    const withoutDue = buildListQuery({
      searchQuery: '',
      filters: new Set<FilterKey>(['targeting', 'unanswered']),
      sortCategory: 'createdAt',
      sortDirection: 'desc',
    });

    expect(withDue.notOverDue).toBe(true);
    expect(withoutDue.notOverDue).toBeUndefined();
    expect(withoutDue.hasMyResponse).toBe(false);
  });

  it('applies notOverDue in tab count query only when due filter is enabled', () => {
    const withDue = buildTabCountQuery({
      searchQuery: '',
      filters: new Set<FilterKey>(['due']),
    });

    const withoutDue = buildTabCountQuery({
      searchQuery: '',
      filters: new Set<FilterKey>([]),
    });

    expect(withDue.notOverDue).toBe(true);
    expect(withoutDue.notOverDue).toBeUndefined();
  });

  it('includes both published and draft questionnaires for the administered filter', () => {
    const administered = buildListQuery({
      searchQuery: '',
      filters: new Set<FilterKey>(['administered']),
      sortCategory: 'createdAt',
      sortDirection: 'desc',
    });

    const draft = buildListQuery({
      searchQuery: '',
      filters: new Set<FilterKey>(['administered', 'unpublished']),
      sortCategory: 'createdAt',
      sortDirection: 'desc',
    });

    expect(administered.onlyAdministratedByMe).toBe(true);
    expect(administered.isDraft).toBeUndefined();
    expect(draft.isDraft).toBe(true);
  });
});
