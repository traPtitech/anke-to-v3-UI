import type { MenuItem } from "primevue/menuitem";
import type { Ref } from "vue";
import {
  buildFilterSignature,
  buildListQuery,
  buildTabCountQuery,
} from "./filter-payload";
import {
    findSelectedTab,
    getQueryValue,
    legacyFilterQueryKeys,
    normalizeFilterSet,
    parseFilterSet,
    resolveTabFromHash,
    serializeFilterSet,
    tabFilterPresets,
    tabs,
} from "./filter-query";
import {
  type SetQueryParamsOptions,
  setRouteQueryParams,
} from "./filter-route";
import {
    buildSortMenuLabel,
    getSortDirectionIcon,
    getSortDirectionLabel,
    isSortCategory,
    sortDirectionOptions,
    sortFieldOptions,
} from "./filter-sort";
import {
    DEFAULT_SORT_CATEGORY,
    DEFAULT_SORT_DIRECTION,
    type ExplorerFilterPayload,
    type FilterKey,
    type SortCategory,
    type SortDirection,
    type TabKey,
} from "./filter-types";

type UseExplorerFilterPanelParams = {
  tabCounts: Ref<Partial<Record<TabKey, number>>>;
  onChange: (payload: ExplorerFilterPayload) => void;
};

type SortMenuRef = {
  toggle: (event: MouseEvent) => void;
};

export const useExplorerFilterPanel = ({
  tabCounts,
  onChange,
}: UseExplorerFilterPanelParams) => {
  const router = useRouter();
  const route = useRoute();

  const isFilterExpanded = ref(false);
  const isSortMenuOpen = ref(false);
  const sortMenuRef = ref<SortMenuRef | null>(null);

  const dateSortDirectionPreference = ref<SortDirection>(
    DEFAULT_SORT_DIRECTION,
  );
  const titleSortDirectionPreference = ref<SortDirection>("asc");

  const getSortDirectionPreference = (
    category: SortCategory,
  ): SortDirection => {
    return category === "title"
      ? titleSortDirectionPreference.value
      : dateSortDirectionPreference.value;
  };

  const setSortDirectionPreference = (
    category: SortCategory,
    direction: SortDirection,
  ) => {
    if (category === "title") {
      titleSortDirectionPreference.value = direction;
      return;
    }

    dateSortDirectionPreference.value = direction;
  };

  const setQueryParams = async (
    patch: Record<string, string | undefined>,
    options: SetQueryParamsOptions = {},
  ) => {
    const removeKeys = Object.hasOwn(patch, "filter")
      ? legacyFilterQueryKeys
      : options.removeKeys;

    await setRouteQueryParams({
      router,
      route,
      patch,
      options: {
        ...options,
        removeKeys,
      },
    });
  };

  const applyFilterSet = async (nextSet: Set<FilterKey>) => {
    await setQueryParams({
      filter: serializeFilterSet(normalizeFilterSet(nextSet)),
    });
  };

  const currentFilterSet = computed(() => parseFilterSet(route.query));

  const hasFilter = (key: FilterKey) => currentFilterSet.value.has(key);

  const setFilter = (key: FilterKey, enabled: boolean) => {
    const nextSet = new Set(currentFilterSet.value);

    if (enabled) {
      nextSet.add(key);
    } else {
      nextSet.delete(key);
    }

    void applyFilterSet(nextSet);
  };

  const filterTargetingMe = computed<boolean>({
    get: () => hasFilter("targeting"),
    set: (value) => setFilter("targeting", value),
  });

  const filterAdministratedByMe = computed<boolean>({
    get: () => hasFilter("administered"),
    set: (value) => setFilter("administered", value),
  });

  const filterHasMyResponse = computed<boolean>({
    get: () => hasFilter("answered"),
    set: (value) => setFilter("answered", value),
  });

  const filterUnansweredByMe = computed<boolean>({
    get: () => hasFilter("unanswered"),
    set: (value) => setFilter("unanswered", value),
  });

  const filterHasMyDraft = computed<boolean>({
    get: () => hasFilter("draft"),
    set: (value) => setFilter("draft", value),
  });

  const filterUnpublishedOnly = computed<boolean>({
    get: () => hasFilter("unpublished"),
    set: (value) => setFilter("unpublished", value),
  });

  const onlyActiveDue = computed<boolean>({
    get: () => hasFilter("due"),
    set: (value) => setFilter("due", value),
  });

  const searchQuery = computed(() => getQueryValue(route.query.search) ?? "");

  const resolveSortFromQuery = (): {
    category: SortCategory;
    direction: SortDirection;
  } => {
    const rawSort = getQueryValue(route.query.sort);
    const category = rawSort !== undefined && isSortCategory(rawSort)
      ? rawSort
      : DEFAULT_SORT_CATEGORY;

    const rawReversed = getQueryValue(route.query.reversed);
    if (rawReversed === "1") {
      return {
        category,
        direction: "desc",
      };
    }

    if (rawReversed === "0") {
      return {
        category,
        direction: "asc",
      };
    }

    return {
      category,
      direction: getSortDirectionPreference(category),
    };
  };

  const sortCategory = computed<SortCategory>(() =>
    resolveSortFromQuery().category
  );
  const sortDirection = computed<SortDirection>(() =>
    resolveSortFromQuery().direction
  );

  const sortMenuLabel = computed(() =>
    buildSortMenuLabel(sortCategory.value, sortDirection.value)
  );

  const setSortQuery = async (
    category: SortCategory,
    direction: SortDirection,
  ) => {
    setSortDirectionPreference(category, direction);

    await setQueryParams({
      sort: category === DEFAULT_SORT_CATEGORY ? undefined : category,
      reversed: direction === "desc" ? "1" : undefined,
    });
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

    const directionItems: MenuItem[] = sortDirectionOptions.map((
      direction,
    ) => ({
      label: getSortDirectionLabel(direction, sortCategory.value),
      icon: getSortDirectionIcon(direction, sortCategory.value),
      command: () => {
        setSortDirection(direction);
      },
    }));

    return [
      {
        label: "並べ替え項目",
        items: fieldItems,
      },
      {
        label: "並び順",
        items: directionItems,
      },
    ];
  });

  const isSortMenuItemSelected = (item: MenuItem) => {
    const itemLabel = item.label ?? "";

    const selectedField = sortFieldOptions.find(
      (option) => option.value === sortCategory.value,
    );
    if (selectedField && itemLabel === selectedField.label) {
      return true;
    }

    return itemLabel ===
      getSortDirectionLabel(sortDirection.value, sortCategory.value);
  };

  const toggleSortMenu = (event: MouseEvent) => {
    sortMenuRef.value?.toggle(event);
  };

  const tabCount = (tab: TabKey) => tabCounts.value[tab] ?? 0;

  const selectedTab = computed<TabKey | null>(() =>
    findSelectedTab(currentFilterSet.value)
  );

  const applyTabPreset = async (
    tab: TabKey,
    options: SetQueryParamsOptions = {},
  ) => {
    await setQueryParams(
      {
        filter: serializeFilterSet(new Set(tabFilterPresets[tab])),
      },
      options,
    );
  };

  const selectTab = (tab: TabKey) => {
    void applyTabPreset(tab);
  };

  watch(
    () => route.hash,
    (hash) => {
      const tab = resolveTabFromHash(hash);
      if (!tab) {
        return;
      }

      void applyTabPreset(tab, { clearHash: true });
    },
    { immediate: true },
  );

  const hasLegacyFilterQuery = computed(() => {
    return legacyFilterQueryKeys.some(
      (key) => getQueryValue(route.query[key]) !== undefined,
    );
  });

  watch(
    hasLegacyFilterQuery,
    (hasLegacy) => {
      if (!hasLegacy) {
        return;
      }

      void setQueryParams({
        filter: serializeFilterSet(currentFilterSet.value),
      });
    },
    { immediate: true },
  );

  const listQuery = computed(() =>
    buildListQuery({
      searchQuery: searchQuery.value,
      filters: currentFilterSet.value,
      sortCategory: sortCategory.value,
      sortDirection: sortDirection.value,
    })
  );

  const tabCountQuery = computed(() =>
    buildTabCountQuery({
      searchQuery: searchQuery.value,
      filters: currentFilterSet.value,
    })
  );

  const signature = computed(() =>
    buildFilterSignature({
      filters: currentFilterSet.value,
      searchQuery: searchQuery.value,
      sortCategory: sortCategory.value,
      sortDirection: sortDirection.value,
    })
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
    isSortMenuOpen,
    sortMenuRef,
    sortMenuItems,
    sortMenuLabel,
    onlyActiveDue,
    filterTargetingMe,
    filterAdministratedByMe,
    filterHasMyResponse,
    filterUnansweredByMe,
    filterHasMyDraft,
    filterUnpublishedOnly,
    selectedTab,
    selectTab,
    tabCount,
    toggleSortMenu,
    isSortMenuItemSelected,
  };
};
