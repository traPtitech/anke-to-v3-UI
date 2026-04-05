<script lang="ts" setup>
import Header from '~/components/layout-elements/header.vue';

const router = useRouter();
const route = useRoute();
const isExplorerRoute = computed(() => route.path.startsWith('/explorer'));
const SEARCH_THROTTLE_MS = 240;
const tabFilterQueryKeys = [
  'targeting',
  'admin',
  'answered',
  'unanswered',
  'draft',
  'unpublished',
] as const;

const getQueryValue = (value: unknown): string | undefined => {
  if (Array.isArray(value)) {
    const first = value[0];
    return typeof first === 'string' ? first : undefined;
  }

  return typeof value === 'string' ? value : undefined;
};

const searchInputText = ref(getQueryValue(route.query.search) ?? '');
let searchThrottleTimer: ReturnType<typeof setTimeout> | null = null;
let queuedSearchValue: string | null = null;
let lastSearchCommittedAt = 0;
let pendingSearchQueryValue: string | null = null;

const applySearchToQuery = (value: string) => {
  const normalized = value.trim();

  if (!isExplorerRoute.value) {
    void navigateTo({
      path: '/explorer',
      query: {
        search: normalized || undefined,
      },
    });
    return;
  }

  const currentQuery = Object.fromEntries(
    Object.entries(route.query)
      .map(([key, queryValue]) => [key, getQueryValue(queryValue)] as const)
      .filter(([, queryValue]) => queryValue !== undefined),
  ) as Record<string, string>;

  const nextQuery: Record<string, string | undefined> = {
    ...currentQuery,
    search: normalized || undefined,
    page: undefined,
  };

  tabFilterQueryKeys.forEach((key) => {
    nextQuery[key] = undefined;
  });

  const cleaned = Object.fromEntries(
    Object.entries(nextQuery).filter(
      ([, queryValue]) => queryValue !== undefined,
    ),
  );

  const hasChanged = JSON.stringify(currentQuery) !== JSON.stringify(cleaned);

  if (!hasChanged) {
    return;
  }

  void router.replace({ query: cleaned });
};

const applySearchWithThrottle = (value: string) => {
  pendingSearchQueryValue = value.trim();
  const now = Date.now();
  const remaining = SEARCH_THROTTLE_MS - (now - lastSearchCommittedAt);
  queuedSearchValue = value;

  if (remaining <= 0) {
    if (searchThrottleTimer) {
      clearTimeout(searchThrottleTimer);
      searchThrottleTimer = null;
    }

    const commitValue = queuedSearchValue;
    queuedSearchValue = null;
    lastSearchCommittedAt = now;

    if (commitValue !== null) {
      applySearchToQuery(commitValue);
    }
    return;
  }

  if (searchThrottleTimer) {
    return;
  }

  searchThrottleTimer = setTimeout(() => {
    searchThrottleTimer = null;
    lastSearchCommittedAt = Date.now();
    const commitValue = queuedSearchValue;
    queuedSearchValue = null;

    if (commitValue !== null) {
      applySearchToQuery(commitValue);
    }
  }, remaining);
};

watch(
  () => route.query.search,
  (searchQuery) => {
    const normalized = getQueryValue(searchQuery) ?? '';

    if (pendingSearchQueryValue !== null) {
      if (normalized === pendingSearchQueryValue) {
        pendingSearchQueryValue = null;
      }
      return;
    }

    if (normalized !== searchInputText.value) {
      searchInputText.value = normalized;
    }
  },
);

onBeforeUnmount(() => {
  if (searchThrottleTimer) {
    clearTimeout(searchThrottleTimer);
  }
  pendingSearchQueryValue = null;
});

const headerSearchText = computed<string>({
  get: () => searchInputText.value,
  set: (value) => {
    searchInputText.value = value;
    applySearchWithThrottle(value);
  },
});
</script>

<template>
  <div class="container">
    <Header v-model:search="headerSearchText" />

    <main :class="{ 'main-explorer': isExplorerRoute }">
      <slot />
    </main>
  </div>
</template>

<style lang="scss" scoped>
.container {
  display: flex;
  flex-direction: column;
  height: 100vh;
}

main {
  flex: 1;
  padding: 32px;
  overflow-y: auto;
}

main.main-explorer {
  padding-top: 0;
}
</style>
