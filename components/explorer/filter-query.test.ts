import { describe, expect, it } from 'vitest';
import {
  buildSortQueryValue,
  buildTabFilterQuery,
  getQueryValue,
  parseFilterSet,
  parseSortState,
} from './filter-query';
import {
  DEFAULT_SORT_CATEGORY,
  DEFAULT_SORT_DIRECTION,
  type FilterKey,
} from './filter-types';

const toSortedArray = (set: Set<FilterKey>) => [...set].sort();

describe('filter-query URL codec', () => {
  it('extracts query value from scalar and array values', () => {
    expect(getQueryValue('value')).toBe('value');
    expect(getQueryValue(['first', 'second'])).toBe('first');
    expect(getQueryValue([1, 'value'])).toBeUndefined();
  });

  it('parses filter query and normalizes it', () => {
    const parsed = parseFilterSet({
      filter: 'answered,unknown,unanswered,due',
    });

    expect(toSortedArray(parsed)).toEqual(['due', 'unanswered']);
  });

  it('builds tab filter query from tab preset', () => {
    expect(buildTabFilterQuery('unanswered')).toBe('targeting,unanswered');
    expect(buildTabFilterQuery('all')).toBeUndefined();
  });

  it('parses unified sort query value', () => {
    expect(parseSortState({ sort: 'modifiedAt:asc' })).toEqual({
      category: 'modifiedAt',
      direction: 'asc',
    });
  });

  it('falls back to defaults when sort query value is invalid', () => {
    expect(parseSortState({ sort: 'modifiedAt' })).toEqual({
      category: DEFAULT_SORT_CATEGORY,
      direction: DEFAULT_SORT_DIRECTION,
    });

    expect(parseSortState({ sort: 'title:asc:extra' })).toEqual({
      category: DEFAULT_SORT_CATEGORY,
      direction: DEFAULT_SORT_DIRECTION,
    });
  });

  it('builds unified sort query value', () => {
    expect(buildSortQueryValue('createdAt', 'asc')).toBe('createdAt:asc');
  });
});
