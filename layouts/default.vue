<script lang="ts" setup>
import { getQueryValue } from '~/components/explorer/filter-query';
import { setRouteQueryParams } from '~/components/explorer/filter-route';
import Header from '~/components/layout-elements/header.vue';

const router = useRouter();
const route = useRoute();
const isExplorerRoute = computed(() => route.path.startsWith('/explorer'));
const SEARCH_DEBOUNCE_MS = 300;

const searchInputText = ref(getQueryValue(route.query.search) ?? '');
let searchDebounceTimer: ReturnType<typeof setTimeout> | null = null;

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

  void setRouteQueryParams({
    router,
    route,
    patch: {
      search: normalized || undefined,
      page: undefined,
    },
  });
};

const applySearchWithDebounce = (value: string) => {
  if (searchDebounceTimer) {
    clearTimeout(searchDebounceTimer);
  }

  searchDebounceTimer = setTimeout(() => {
    applySearchToQuery(value);
  }, SEARCH_DEBOUNCE_MS);
};

watch(
  () => route.query.search,
  (searchQuery) => {
    const normalized = getQueryValue(searchQuery) ?? '';

    if (normalized !== searchInputText.value) {
      searchInputText.value = normalized;
    }
  },
);

onBeforeUnmount(() => {
  if (searchDebounceTimer) {
    clearTimeout(searchDebounceTimer);
  }
});

const headerSearchText = computed<string>({
  get: () => searchInputText.value,
  set: (value) => {
    searchInputText.value = value;
    applySearchWithDebounce(value);
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
  padding: 28px 24px;
  overflow-y: auto;
}

main.main-explorer {
  padding-top: 0;
}

@media screen and (max-width: 900px) {
  main {
    padding: 20px 16px;
  }
}

@media screen and (max-width: 560px) {
  main {
    padding: 12px;
  }
}
</style>
