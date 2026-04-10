import { describe, expect, it, vi } from 'vitest';
import { setRouteQueryParams, toStringQueryRecord } from './filter-route';

describe('filter-route URL sync', () => {
  it('normalizes query values into string record', () => {
    const normalized = toStringQueryRecord({
      scalar: '1',
      array: ['2', '3'],
      number: 10,
      invalidArray: [1, '2'],
    });

    expect(normalized).toEqual({
      scalar: '1',
      array: '2',
    });
  });

  it('applies patch/removeKeys', async () => {
    const replace = vi.fn().mockResolvedValue(undefined);

    await setRouteQueryParams({
      router: {
        replace,
      },
      route: {
        query: {
          a: '1',
          b: ['2'],
          c: '3',
        },
      },
      patch: {
        a: '10',
        b: undefined,
        d: '20',
      },
      options: {
        removeKeys: ['c'],
      },
    });

    expect(replace).toHaveBeenCalledTimes(1);
    expect(replace).toHaveBeenCalledWith({
      query: {
        a: '10',
        d: '20',
      },
    });
  });

  it('skips replace when query is unchanged', async () => {
    const replace = vi.fn().mockResolvedValue(undefined);

    await setRouteQueryParams({
      router: {
        replace,
      },
      route: {
        query: {
          a: '1',
        },
      },
      patch: {
        a: '1',
      },
    });

    expect(replace).not.toHaveBeenCalled();
  });
});
