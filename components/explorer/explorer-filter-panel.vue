<script lang="ts" setup>
import type { MenuItem } from 'primevue/menuitem';
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
} from './filter-query';
import {
  DATE_SORT_ORDER_STORAGE_KEY,
  TITLE_SORT_ORDER_STORAGE_KEY,
  buildSortMenuLabel,
  getSortDirectionIcon,
  getSortDirectionLabel,
  isSortCategory,
  sortDirectionOptions,
  sortFieldOptions,
  toApiSort,
} from './filter-sort';
import type {
  ExplorerFilterPayload,
  FilterKey,
  SortCategory,
  SortDirection,
  SortOptionValue,
  TabKey,
} from './filter-types';

const ONLY_ACTIVE_DUE_STORAGE_KEY = 'explorer.onlyActiveDue';

type SortMenuEntry = MenuItem & {
  selected?: boolean;
  iconName?: string;
};

type SetQueryParamsOptions = {
  clearHash?: boolean;
};

const props = withDefaults(
  defineProps<{
    tabCounts?: Partial<Record<TabKey, number>>;
  }>(),
  {
    tabCounts: () => ({}),
  },
);

const emit = defineEmits<{
  change: [payload: ExplorerFilterPayload];
}>();

const router = useRouter();
const route = useRoute();

const isFilterExpanded = ref(false);
const isSortMenuOpen = ref(false);
const sortMenuRef = ref<{ toggle: (event: MouseEvent) => void } | null>(null);

const dateSortDirectionPreference = ref<SortDirection>('desc');
const titleSortDirectionPreference = ref<SortDirection>('asc');

const getSortDirectionPreference = (category: SortCategory): SortDirection => {
  if (category === 'title') {
    return titleSortDirectionPreference.value;
  }

  return dateSortDirectionPreference.value;
};

const setSortDirectionPreference = (
  category: SortCategory,
  direction: SortDirection,
) => {
  if (category === 'title') {
    titleSortDirectionPreference.value = direction;

    if (import.meta.client) {
      localStorage.setItem(TITLE_SORT_ORDER_STORAGE_KEY, direction);
    }
    return;
  }

  dateSortDirectionPreference.value = direction;

  if (import.meta.client) {
    localStorage.setItem(DATE_SORT_ORDER_STORAGE_KEY, direction);
  }
};

const restoreStoredSortDirectionPreferences = () => {
  if (!import.meta.client) {
    return;
  }

  const storedDateOrder = localStorage.getItem(DATE_SORT_ORDER_STORAGE_KEY);
  if (storedDateOrder === 'asc' || storedDateOrder === 'desc') {
    dateSortDirectionPreference.value = storedDateOrder;
  }

  const storedTitleOrder = localStorage.getItem(TITLE_SORT_ORDER_STORAGE_KEY);
  if (storedTitleOrder === 'asc' || storedTitleOrder === 'desc') {
    titleSortDirectionPreference.value = storedTitleOrder;
  }
};

const setQueryParams = async (
  patch: Record<string, string | undefined>,
  options: SetQueryParamsOptions = {},
) => {
  const currentQuery = Object.fromEntries(
    Object.entries(route.query)
      .map(([key, value]) => [key, getQueryValue(value)] as const)
      .filter(([, value]) => value !== undefined),
  ) as Record<string, string>;

  const nextQueryMap = new Map(Object.entries(currentQuery));

  Object.entries(patch).forEach(([key, value]) => {
    if (value === undefined) {
      nextQueryMap.delete(key);
      return;
    }

    nextQueryMap.set(key, value);
  });

  if (Object.hasOwn(patch, 'filter')) {
    legacyFilterQueryKeys.forEach((legacyKey) => {
      nextQueryMap.delete(legacyKey);
    });
  }

  const nextQuery = Object.fromEntries(nextQueryMap) as Record<string, string>;

  const changed =
    nextQueryMap.size !== Object.keys(currentQuery).length ||
    Object.entries(currentQuery).some(
      ([key, value]) => nextQuery[key] !== value,
    );
  const shouldClearHash = options.clearHash === true && route.hash.length > 0;

  if (!changed && !shouldClearHash) {
    return;
  }

  await router.replace({
    query: nextQuery,
    hash: shouldClearHash ? '' : route.hash,
  });
};

const applyFilterSet = async (nextSet: Set<FilterKey>) => {
  await setQueryParams({
    filter: serializeFilterSet(normalizeFilterSet(nextSet)),
  });
};

const currentFilterSet = computed(() =>
  parseFilterSet(route.query as Record<string, unknown>),
);

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
  get: () => hasFilter('targeting'),
  set: (value) => setFilter('targeting', value),
});

const filterAdministratedByMe = computed<boolean>({
  get: () => hasFilter('administered'),
  set: (value) => setFilter('administered', value),
});

const filterHasMyResponse = computed<boolean>({
  get: () => hasFilter('answered'),
  set: (value) => setFilter('answered', value),
});

const filterUnansweredByMe = computed<boolean>({
  get: () => hasFilter('unanswered'),
  set: (value) => setFilter('unanswered', value),
});

const filterHasMyDraft = computed<boolean>({
  get: () => hasFilter('draft'),
  set: (value) => setFilter('draft', value),
});

const filterUnpublishedOnly = computed<boolean>({
  get: () => hasFilter('unpublished'),
  set: (value) => setFilter('unpublished', value),
});

const searchQuery = computed(() => getQueryValue(route.query.search) ?? '');
const searchInput = ref(searchQuery.value);

let searchDebounceTimer: ReturnType<typeof setTimeout> | undefined;

watch(searchQuery, (value) => {
  if (value !== searchInput.value) {
    searchInput.value = value;
  }
});

watch(searchInput, (value) => {
  if (searchDebounceTimer) {
    clearTimeout(searchDebounceTimer);
  }

  searchDebounceTimer = setTimeout(() => {
    const normalizedValue = value.trim();
    const currentValue = (getQueryValue(route.query.search) ?? '').trim();

    if (normalizedValue === currentValue) {
      return;
    }

    void setQueryParams({ search: normalizedValue || undefined });
  }, 300);
});

onBeforeUnmount(() => {
  if (searchDebounceTimer) {
    clearTimeout(searchDebounceTimer);
  }
});

const onlyActiveDue = computed<boolean>({
  get: () => getQueryValue(route.query.due) === '1',
  set: (value) => {
    void setQueryParams({ due: value ? '1' : undefined });
  },
});

const resolveSortFromQuery = (): {
  category: SortCategory;
  direction: SortDirection;
} => {
  const rawSort = getQueryValue(route.query.sort);
  const rawReversed = getQueryValue(route.query.reversed);
  const category = rawSort && isSortCategory(rawSort) ? rawSort : 'createdAt';
  const direction =
    rawReversed === undefined
      ? getSortDirectionPreference(category)
      : rawReversed === '1'
        ? 'desc'
        : 'asc';

  return {
    category,
    direction,
  };
};

const sortOption = computed<SortOptionValue>({
  get: (): SortOptionValue => {
    const { category, direction } = resolveSortFromQuery();
    return `${category}:${direction}` as SortOptionValue;
  },
  set: (value: SortOptionValue) => {
    const [category, direction] = value.split(':') as [
      SortCategory,
      SortDirection,
    ];

    setSortDirectionPreference(category, direction);

    void setQueryParams({
      sort: category === 'createdAt' ? undefined : category,
      reversed: direction === 'desc' ? '1' : undefined,
    });
  },
});

const sortCategory = computed<SortCategory>(
  () => sortOption.value.split(':')[0] as SortCategory,
);

const sortDirection = computed<SortDirection>(
  () => sortOption.value.split(':')[1] as SortDirection,
);

const sortMenuLabel = computed(() =>
  buildSortMenuLabel(sortCategory.value, sortDirection.value),
);

const setSortCategory = (category: SortCategory) => {
  const direction = getSortDirectionPreference(category);
  sortOption.value = `${category}:${direction}` as SortOptionValue;
};

const setSortDirection = (direction: SortDirection) => {
  sortOption.value = `${sortCategory.value}:${direction}` as SortOptionValue;
};

const sortMenuItems = computed<MenuItem[]>(() => {
  const fieldItems: SortMenuEntry[] = sortFieldOptions.map((option) => ({
    label: option.label,
    selected: sortCategory.value === option.value,
    command: () => {
      setSortCategory(option.value);
    },
  }));

  const directionItems: SortMenuEntry[] = sortDirectionOptions.map(
    (direction) => ({
      label: getSortDirectionLabel(direction, sortCategory.value),
      selected: sortDirection.value === direction,
      iconName: getSortDirectionIcon(direction, sortCategory.value),
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
  return (item as SortMenuEntry).selected === true;
};

const getSortMenuItemIconName = (item: MenuItem) => {
  return (item as SortMenuEntry).iconName ?? '';
};

const toggleSortMenu = (event: MouseEvent) => {
  sortMenuRef.value?.toggle(event);
};

const tabCount = (tab: TabKey) => props.tabCounts[tab] ?? 0;

const selectedTab = computed<TabKey | null>(() =>
  findSelectedTab(currentFilterSet.value),
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

if (import.meta.client) {
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
}

onMounted(() => {
  restoreStoredSortDirectionPreferences();

  const hasDueQuery = getQueryValue(route.query.due) !== undefined;
  const storedDue = localStorage.getItem(ONLY_ACTIVE_DUE_STORAGE_KEY);
  if (!hasDueQuery && (storedDue === '0' || storedDue === '1')) {
    onlyActiveDue.value = storedDue === '1';
  }
});

watch(onlyActiveDue, (value) => {
  if (import.meta.client) {
    localStorage.setItem(ONLY_ACTIVE_DUE_STORAGE_KEY, value ? '1' : '0');
  }
});

const listQuery = computed<ExplorerFilterPayload['listQuery']>(() => {
  const trimmedSearch = searchQuery.value.trim();
  const filters = currentFilterSet.value;

  return {
    search: trimmedSearch || undefined,
    sort: toApiSort(sortOption.value),
    onlyTargetingMe:
      filters.has('targeting') || filters.has('unanswered') ? true : undefined,
    onlyAdministratedByMe: filters.has('administered') ? true : undefined,
    notOverDue:
      onlyActiveDue.value || filters.has('unanswered') ? true : undefined,
    hasMyResponse: filters.has('answered')
      ? true
      : filters.has('unanswered')
        ? false
        : undefined,
    hasMyDraft: filters.has('draft') ? true : undefined,
    isDraft: filters.has('unpublished')
      ? true
      : filters.has('unanswered')
        ? false
        : undefined,
  };
});

const tabCountQuery = computed<ExplorerFilterPayload['tabCountQuery']>(() => {
  const trimmedSearch = searchQuery.value.trim();

  return {
    search: trimmedSearch || undefined,
    notOverDue: onlyActiveDue.value ? true : undefined,
  };
});

const signature = computed(() =>
  JSON.stringify({
    filter: serializeFilterSet(currentFilterSet.value) ?? '',
    search: tabCountQuery.value.search ?? '',
    due: onlyActiveDue.value ? '1' : '0',
    sort: sortOption.value,
  }),
);

watchEffect(() => {
  emit('change', {
    signature: signature.value,
    listQuery: listQuery.value,
    tabCountQuery: tabCountQuery.value,
  });
});
</script>

<template>
  <div class="explorer-filter-panel">
    <div class="tab-row">
      <button
        v-for="tab in tabs"
        :key="tab.key"
        type="button"
        class="tab-button"
        :class="{ active: selectedTab === tab.key }"
        @click="selectTab(tab.key)"
      >
        {{ tab.label }}
        <span class="tab-count">({{ tabCount(tab.key) }})</span>
      </button>
    </div>

    <section class="filter-shell">
      <div class="filter-row">
        <div class="summary-control sort-menu">
          <button
            type="button"
            class="sort-menu-trigger"
            aria-haspopup="menu"
            :aria-expanded="isSortMenuOpen"
            @click="toggleSortMenu"
          >
            <span class="sort-menu-trigger-label">並べ方</span>
            <span class="sort-menu-trigger-current">{{ sortMenuLabel }}</span>
            <Icon
              name="mdi:chevron-down"
              size="16px"
              :class="['sort-menu-trigger-chevron', { open: isSortMenuOpen }]"
            />
          </button>

          <Menu
            ref="sortMenuRef"
            :model="sortMenuItems"
            popup
            class="sort-menu-overlay"
            @show="isSortMenuOpen = true"
            @hide="isSortMenuOpen = false"
          >
            <template #item="{ item, props: itemProps }">
              <a
                v-bind="itemProps.action"
                class="sort-menu-item-link"
                :class="{ selected: isSortMenuItemSelected(item) }"
              >
                <Icon
                  name="mdi:check"
                  size="16px"
                  class="sort-menu-item-check"
                  :class="{ visible: isSortMenuItemSelected(item) }"
                />
                <Icon
                  v-if="getSortMenuItemIconName(item)"
                  :name="getSortMenuItemIconName(item)"
                  size="22px"
                  class="sort-menu-order-icon"
                />
                <span>{{ item.label }}</span>
              </a>
            </template>
          </Menu>
        </div>

        <div class="due-toggle">
          <label for="toggle-active-due">期限内のみ</label>
          <ToggleSwitch id="toggle-active-due" v-model="onlyActiveDue" />
        </div>

        <Button
          class="advanced-filter-toggle"
          severity="secondary"
          outlined
          :aria-label="
            isFilterExpanded ? '高度なフィルタを閉じる' : '高度なフィルタを開く'
          "
          :title="
            isFilterExpanded ? '高度なフィルタを閉じる' : '高度なフィルタを開く'
          "
          @click="isFilterExpanded = !isFilterExpanded"
        >
          <Icon
            :name="
              isFilterExpanded
                ? 'mdi:filter-minus-outline'
                : 'mdi:filter-plus-outline'
            "
            size="18px"
          />
        </Button>
      </div>

      <Accordion
        :value="isFilterExpanded ? 'advanced' : undefined"
        class="advanced-filter-accordion"
      >
        <AccordionPanel value="advanced">
          <AccordionHeader class="advanced-filter-hidden-header">
            高度なフィルタ
          </AccordionHeader>
          <AccordionContent>
            <div class="advanced-filter-panel">
              <div class="advanced-filter-search search-field-with-icon">
                <Icon class="search-icon" name="mdi:magnify" size="20px" />
                <InputText
                  v-model="searchInput"
                  placeholder="タイトルで検索"
                  class="search-input"
                />
              </div>

              <div class="advanced-filter-grid">
                <div class="advanced-filter-block">
                  <div class="advanced-filter-title">回答</div>
                  <label class="advanced-switch-item" for="advanced-targeting">
                    <Checkbox
                      v-model="filterTargetingMe"
                      input-id="advanced-targeting"
                      binary
                    />
                    <span>自分が対象</span>
                  </label>
                  <label class="advanced-switch-item" for="advanced-answered">
                    <Checkbox
                      v-model="filterHasMyResponse"
                      input-id="advanced-answered"
                      binary
                    />
                    <span>自分が回答済み</span>
                  </label>
                  <label class="advanced-switch-item" for="advanced-unanswered">
                    <Checkbox
                      v-model="filterUnansweredByMe"
                      input-id="advanced-unanswered"
                      binary
                    />
                    <span>自分が未回答</span>
                  </label>
                  <label class="advanced-switch-item" for="advanced-draft">
                    <Checkbox
                      v-model="filterHasMyDraft"
                      input-id="advanced-draft"
                      binary
                    />
                    <span>自分の下書きあり</span>
                  </label>
                </div>

                <div class="advanced-filter-block">
                  <div class="advanced-filter-title">管理</div>
                  <label class="advanced-switch-item" for="advanced-admin">
                    <Checkbox
                      v-model="filterAdministratedByMe"
                      input-id="advanced-admin"
                      binary
                    />
                    <span>自分が管理中</span>
                  </label>
                  <label
                    class="advanced-switch-item"
                    for="advanced-unpublished"
                  >
                    <Checkbox
                      v-model="filterUnpublishedOnly"
                      input-id="advanced-unpublished"
                      binary
                    />
                    <span>未公開 (下書き)</span>
                  </label>
                </div>
              </div>
            </div>
          </AccordionContent>
        </AccordionPanel>
      </Accordion>
    </section>
  </div>
</template>

<style scoped lang="scss">
.explorer-filter-panel {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.tab-row {
  display: flex;
  flex-wrap: nowrap;
  align-items: center;
  gap: 8px;
  overflow-x: auto;
  border-bottom: 1px solid var(--p-surface-300);
  padding: 10px 0;
  background-color: var(--p-surface-0);
}

.tab-button {
  flex: 0 0 auto;
  border: none;
  border-radius: 999px;
  background-color: var(--p-surface-100);
  color: var(--p-text-color);
  font-weight: 700;
  line-height: 1;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 10px 14px;
}

.tab-button.active {
  background-color: color-mix(in srgb, variables.$color-primary 15%, white);
  color: variables.$color-primary;
}

.tab-count {
  color: var(--p-text-secondary);
}

.filter-shell {
  border: 1px solid var(--p-surface-300);
  border-radius: var(--p-border-radius-md);
  background-color: var(--p-surface-0);
  overflow: hidden;
}

.filter-row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 12px;
  padding: 12px;
}

.summary-control {
  min-width: 220px;
}

.sort-menu {
  position: relative;
}

.sort-menu-trigger {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  min-height: 40px;
  border: 1px solid var(--p-surface-300);
  border-radius: var(--p-border-radius-md);
  padding: 8px 12px;
  background-color: var(--p-surface-0);
  color: var(--p-text-color);
  cursor: pointer;
}

.sort-menu-trigger-label {
  color: var(--p-text-secondary);
  font-size: 13px;
}

.sort-menu-trigger-current {
  font-size: 14px;
  font-weight: 600;
}

.sort-menu-trigger-chevron {
  transition: transform 0.18s ease;
}

.sort-menu-trigger-chevron.open {
  transform: rotate(180deg);
}

.sort-menu-item-link {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--p-text-color);
  text-decoration: none;
  padding: 8px 12px;
}

.sort-menu-item-link.selected {
  font-weight: 600;
}

.sort-menu-item-check {
  opacity: 0;
}

.sort-menu-item-check.visible {
  opacity: 1;
}

.sort-menu-order-icon {
  color: var(--p-text-secondary);
}

.sort-menu-item-link.selected .sort-menu-order-icon {
  color: var(--p-text-color);
}

:deep(.sort-menu-overlay.p-menu) {
  min-width: 260px;
}

:deep(.sort-menu-overlay .p-menu-submenu-label) {
  font-size: 12px;
  color: var(--p-text-secondary);
  font-weight: 700;
  padding: 10px 12px 6px;
}

:deep(.sort-menu-overlay .p-menu-item-link) {
  padding: 0;
}

.due-toggle {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
}

.advanced-filter-toggle {
  margin-left: auto;
  width: 40px;
  min-height: 40px;
  padding: 0;
}

.advanced-filter-panel {
  border-top: 1px solid var(--p-surface-300);
  padding: 14px 12px 12px;
  background-color: var(--p-surface-0);
}

.advanced-filter-search {
  margin-bottom: 12px;
}

.search-field-with-icon {
  position: relative;
}

.search-icon {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--p-text-secondary);
  pointer-events: none;
  z-index: 1;
}

.search-input {
  width: 100%;
  padding-left: 40px;
}

.advanced-filter-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
}

.advanced-filter-block {
  border: 1px solid var(--p-surface-300);
  border-radius: var(--p-border-radius-md);
  padding: 10px;
  background-color: var(--p-surface-0);
}

.advanced-filter-title {
  margin-bottom: 8px;
  font-size: 13px;
  font-weight: 700;
  color: var(--p-text-secondary);
}

.advanced-switch-item {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  cursor: pointer;
}

.advanced-switch-item + .advanced-switch-item {
  margin-top: 8px;
}

:deep(.advanced-filter-accordion .p-accordionpanel),
:deep(.advanced-filter-accordion .p-accordioncontent) {
  border: none;
}

:deep(.advanced-filter-accordion .p-accordionheader) {
  display: none;
}

:deep(.advanced-filter-accordion .p-accordioncontent-content) {
  padding: 0;
}

.advanced-filter-hidden-header {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

@media screen and (max-width: 900px) {
  .advanced-filter-grid {
    grid-template-columns: 1fr;
  }
}

@media screen and (max-width: 560px) {
  .summary-control {
    min-width: 0;
    width: 100%;
  }

  .sort-menu-trigger {
    width: 100%;
    justify-content: space-between;
  }

  .due-toggle {
    width: 100%;
    justify-content: flex-start;
  }

  .advanced-filter-toggle {
    margin-left: 0;
  }
}
</style>
