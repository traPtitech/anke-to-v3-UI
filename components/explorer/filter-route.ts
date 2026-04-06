import { getQueryValue } from "./filter-query";

export type SetQueryParamsOptions = {
  clearHash?: boolean;
  removeKeys?: string[];
};

type QueryRoute = {
  query: Record<string, unknown>;
  hash: string;
};

type QueryRouter = {
  replace: (to: { query: Record<string, string>; hash: string }) => unknown;
};

export const toStringQueryRecord = (
  query: Record<string, unknown>,
): Record<string, string> => {
  const record: Record<string, string> = {};

  Object.entries(query).forEach(([key, value]) => {
    const normalizedValue = getQueryValue(value);
    if (normalizedValue !== undefined) {
      record[key] = normalizedValue;
    }
  });

  return record;
};

const hasQueryChanged = (
  currentQuery: Record<string, string>,
  nextQuery: Record<string, string>,
): boolean => {
  const currentKeys = Object.keys(currentQuery);
  const nextKeys = Object.keys(nextQuery);

  if (currentKeys.length !== nextKeys.length) {
    return true;
  }

  return currentKeys.some((key) => currentQuery[key] !== nextQuery[key]);
};

export const setRouteQueryParams = async ({
  router,
  route,
  patch,
  options = {},
}: {
  router: QueryRouter;
  route: QueryRoute;
  patch: Record<string, string | undefined>;
  options?: SetQueryParamsOptions;
}) => {
  const currentQuery = toStringQueryRecord(route.query);
  const nextQueryMap = new Map(Object.entries(currentQuery));

  Object.entries(patch).forEach(([key, value]) => {
    if (value === undefined) {
      nextQueryMap.delete(key);
      return;
    }

    nextQueryMap.set(key, value);
  });

  options.removeKeys?.forEach((key) => {
    nextQueryMap.delete(key);
  });

  const nextQuery: Record<string, string> = {};
  nextQueryMap.forEach((value, key) => {
    nextQuery[key] = value;
  });

  const shouldClearHash = options.clearHash === true && route.hash.length > 0;

  if (!hasQueryChanged(currentQuery, nextQuery) && !shouldClearHash) {
    return;
  }

  await router.replace({
    query: nextQuery,
    hash: shouldClearHash ? "" : route.hash,
  });
};
