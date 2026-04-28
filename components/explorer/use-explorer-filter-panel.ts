import type { MenuItem } from 'primevue/menuitem';
import type { Ref } from 'vue';
import {
  applyAdvancedFilterState,
  findSelectedTab,
  parseAdvancedFilterState,
  setFilterEnabled,
  tabFilterPresets,
  tabs,
} from './filter-domain';
import {
  buildFilterSignature,
  buildListQuery,
  buildTabCountQuery,
} from './filter-payload';
import {
  buildSortMenuLabel,
  getSortDirectionIcon,
  getSortDirectionLabel,
  sortDirectionOptions,
  sortFieldOptions,
} from './filter-sort';
import {
  DEFAULT_SORT_DIRECTION,
  type ExplorerAdvancedFilterState,
  type ExplorerFilterPayload,
  type FilterKey,
  type SortCategory,
  type SortDirection,
  type TabKey,
} from './filter-types';
import { useExplorerFilterUrlSync } from './use-explorer-filter-url-sync';

type UseExplorerFilterPanelParams = {
  tabCounts: Ref<Partial<Record<TabKey, number | string>>>;
  tabCountsLoading: Ref<boolean>;
  onChange: (payload: ExplorerFilterPayload) => void;
};

export const useExplorerFilterPanel = ({
  tabCounts,
  tabCountsLoading,
  onChange,
}: UseExplorerFilterPanelParams) => {
  const {
    filterSet: currentFilterSet,
    searchQuery,
    sortState,
    setFilterSet,
    setSearchQuery,
    setSortState,
  } = useExplorerFilterUrlSync();

  const isFilterExpanded = ref(false);
  const searchInputText = ref(searchQuery.value);
  const SEARCH_DEBOUNCE_MS = 300;
  let searchDebounceTimer: ReturnType<typeof setTimeout> | null = null;

  const applySearchWithDebounce = (value: string) => {
    if (searchDebounceTimer) {
      clearTimeout(searchDebounceTimer);
    }

    searchDebounceTimer = setTimeout(() => {
      void setSearchQuery(value);
    }, SEARCH_DEBOUNCE_MS);
  };

  watch(searchQuery, (nextQuery) => {
    if (nextQuery !== searchInputText.value) {
      searchInputText.value = nextQuery;
    }
  });

  onBeforeUnmount(() => {
    if (searchDebounceTimer) {
      clearTimeout(searchDebounceTimer);
    }
  });

  const mobileSearchText = computed<string>({
    get: () => searchInputText.value,
    set: (value) => {
      searchInputText.value = value;
      applySearchWithDebounce(value);
    },
  });

  const dateSortDirectionPreference = ref<SortDirection>(
    DEFAULT_SORT_DIRECTION,
  );
  const titleSortDirectionPreference = ref<SortDirection>('asc');

  const getSortDirectionPreference = (
    category: SortCategory,
  ): SortDirection => {
    return category === 'title'
      ? titleSortDirectionPreference.value
      : dateSortDirectionPreference.value;
  };

  const setSortDirectionPreference = (
    category: SortCategory,
    direction: SortDirection,
  ) => {
    if (category === 'title') {
      titleSortDirectionPreference.value = direction;
      return;
    }

    dateSortDirectionPreference.value = direction;
  };

  const hasFilter = (key: FilterKey) => currentFilterSet.value.has(key);

  const setFilter = (key: FilterKey, enabled: boolean) => {
    const nextSet = setFilterEnabled({
      filters: currentFilterSet.value,
      key,
      enabled,
    });

    void setFilterSet(nextSet);
  };

  const parsedAdvancedFilterState = computed(() =>
    parseAdvancedFilterState(currentFilterSet.value),
  );

  const advancedFilterState = computed<ExplorerAdvancedFilterState>({
    get: () => parsedAdvancedFilterState.value,
    set: (nextState) => {
      const nextSet = applyAdvancedFilterState({
        currentFilters: currentFilterSet.value,
        nextState,
      });

      void setFilterSet(nextSet);
    },
  });

  const onlyActiveDue = computed<boolean>({
    get: () => hasFilter('due'),
    set: (value) => setFilter('due', value),
  });

  watch(
    sortState,
    ({ category, direction }) => {
      setSortDirectionPreference(category, direction);
    },
    { immediate: true },
  );

  const sortCategory = computed<SortCategory>(() => sortState.value.category);
  const sortDirection = computed<SortDirection>(
    () => sortState.value.direction,
  );

  const sortMenuLabel = computed(() =>
    buildSortMenuLabel(sortCategory.value, sortDirection.value),
  );

  const setSortQuery = async (
    category: SortCategory,
    direction: SortDirection,
  ) => {
    setSortDirectionPreference(category, direction);

    await setSortState(category, direction);
  };

  const setSortCategory = (category: SortCategory) => {
    const direction = getSortDirectionPreference(category);
    void setSortQuery(category, direction);
  };

  const setSortDirection = (direction: SortDirection) => {
    void setSortQuery(sortCategory.value, direction);
  };

  const sortMenuItems = computed<MenuItem[]>(() => {
    const fieldItems: MenuItem[] = sortFieldOptions.map((option) => ({
      label: option.label,
      command: () => {
        setSortCategory(option.value);
      },
    }));

    const directionItems: MenuItem[] = sortDirectionOptions.map(
      (direction) => ({
        label: getSortDirectionLabel(direction, sortCategory.value),
        icon: getSortDirectionIcon(direction, sortCategory.value),
        command: () => {
          setSortDirection(direction);
        },
      }),
    );

    return [
      {
        label: '並べ替え項目',
        items: fieldItems,
      },
      {
        label: '並び順',
        items: directionItems,
      },
    ];
  });

  const isSortMenuItemSelected = (item: MenuItem) => {
    const itemLabel = item.label ?? '';

    const selectedField = sortFieldOptions.find(
      (option) => option.value === sortCategory.value,
    );
    if (selectedField && itemLabel === selectedField.label) {
      return true;
    }

    return (
      itemLabel ===
      getSortDirectionLabel(sortDirection.value, sortCategory.value)
    );
  };

  const tabCount = (tab: TabKey) => {
    if (tabCountsLoading.value) {
      return '?';
    }

    return tabCounts.value[tab] ?? 0;
  };

  const selectedTab = computed<TabKey | null>(() =>
    findSelectedTab(currentFilterSet.value),
  );

  const selectTab = (tab: TabKey) => {
    const nextSet = new Set(tabFilterPresets[tab]);
    if (currentFilterSet.value.has('due')) {
      nextSet.add('due');
    }

    void setFilterSet(nextSet);
  };

  const listQuery = computed(() =>
    buildListQuery({
      searchQuery: searchQuery.value,
      filters: currentFilterSet.value,
      sortCategory: sortCategory.value,
      sortDirection: sortDirection.value,
    }),
  );

  const tabCountQuery = computed(() =>
    buildTabCountQuery({
      searchQuery: searchQuery.value,
      filters: currentFilterSet.value,
    }),
  );

  const signature = computed(() =>
    buildFilterSignature({
      filters: currentFilterSet.value,
      searchQuery: searchQuery.value,
      sortCategory: sortCategory.value,
      sortDirection: sortDirection.value,
    }),
  );

  watchEffect(() => {
    onChange({
      signature: signature.value,
      listQuery: listQuery.value,
      tabCountQuery: tabCountQuery.value,
    });
  });

  return {
    tabs,
    isFilterExpanded,
    mobileSearchText,
    sortMenuItems,
    sortMenuLabel,
    onlyActiveDue,
    advancedFilterState,
    selectedTab,
    selectTab,
    tabCount,
    isSortMenuItemSelected,
  };
};
