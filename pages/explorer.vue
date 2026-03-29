<script lang="ts" setup>
import QuestionnaireList from '~/components/ui/questionnaire-list/questionnaire-list.vue';
import {
  fetchQuestionnaires,
  type GetQuestionnairesOption,
} from '~/composables/type-fetch/anke-to/client';
import type { components } from '~/composables/type-fetch/anke-to/openapi';

const router = useRouter();
const route = useRoute();

type QuestionnaireSummary = components['schemas']['QuestionnaireSummary'];
type TabKey = 'unanswered' | 'all' | 'answered' | 'administered' | 'draft';
type SortCategory = 'createdAt' | 'modifiedAt' | 'title';
type SortFieldOptionValue = SortCategory | 'dueAt';
type SortDirection = 'asc' | 'desc';
type SortOptionValue = `${SortCategory}:${SortDirection}`;
const PAGE_SIZE = 20;
const ONLY_ACTIVE_DUE_STORAGE_KEY = 'explorer.onlyActiveDue';
const DATE_SORT_ORDER_STORAGE_KEY = 'explorer.sortOrder.date';
const TITLE_SORT_ORDER_STORAGE_KEY = 'explorer.sortOrder.title';
const DUE_SORT_ORDER_STORAGE_KEY = 'explorer.sortOrder.due';
const hashTabMap: Record<string, TabKey> = {
  all: 'all',
  unanswered: 'unanswered',
  answered: 'answered',
  administered: 'administered',
  admin: 'administered',
  draft: 'draft',
};

type SetQueryParamsOptions = {
  clearHash?: boolean;
};

type DetailedFilterPreset = {
  targetingMe: boolean;
  administratedByMe: boolean;
  hasMyResponse: boolean;
  unansweredByMe: boolean;
  hasMyDraft: boolean;
  unpublishedOnly: boolean;
};

const tabs: { key: TabKey; label: string }[] = [
  { key: 'unanswered', label: '未回答' },
  { key: 'all', label: 'すべて' },
  { key: 'answered', label: '回答済み' },
  { key: 'administered', label: '管理中' },
  { key: 'draft', label: '下書き' },
];

type SortFieldOption = {
  label: string;
  value: SortFieldOptionValue;
  visualDisabled?: boolean;
};

const sortFieldOptions: SortFieldOption[] = [
  { label: '作成日時', value: 'createdAt' },
  { label: '更新日時', value: 'modifiedAt' },
  { label: '締め切り', value: 'dueAt', visualDisabled: true },
  { label: 'タイトル', value: 'title' },
];

const sortDirectionOptions: SortDirection[] = ['asc', 'desc'];

const sortFieldLabelMap: Record<SortFieldOptionValue, string> = {
  createdAt: '作成日時',
  modifiedAt: '更新日時',
  dueAt: '締め切り',
  title: 'タイトル',
};

const defaultSortDirectionLabelMap: Record<SortDirection, string> = {
  asc: '昇順',
  desc: '降順',
};

const dateSortDirectionLabelMap: Record<SortDirection, string> = {
  asc: '古い順',
  desc: '新しい順',
};

const dueSortDirectionLabelMap: Record<SortDirection, string> = {
  asc: '早い順',
  desc: '遅い順',
};

const getSortDirectionLabel = (
  direction: SortDirection,
  category: SortFieldOptionValue,
) => {
  if (category === 'createdAt' || category === 'modifiedAt') {
    return dateSortDirectionLabelMap[direction];
  }

  if (category === 'dueAt') {
    return dueSortDirectionLabelMap[direction];
  }

  return defaultSortDirectionLabelMap[direction];
};

const getSortDirectionIcon = (
  direction: SortDirection,
  category: SortFieldOptionValue,
) => {
  if (category === 'createdAt' || category === 'modifiedAt') {
    return `mdi:sort-clock-${direction}ending-outline`;
  }

  if (category === 'dueAt') {
    return `mdi:sort-calendar-${direction}ending`;
  }

  return `mdi:sort-alphabetical-${direction}ending`;
};

const dateSortDirectionPreference = ref<SortDirection>('desc');
const titleSortDirectionPreference = ref<SortDirection>('asc');
const dueSortDirectionPreference = ref<SortDirection>('asc');
const isDueSortSelected = ref(false);

const isSortCategory = (value: string): value is SortCategory => {
  return value === 'createdAt' || value === 'modifiedAt' || value === 'title';
};

const getSortDirectionPreference = (
  category: SortFieldOptionValue,
): SortDirection => {
  if (category === 'dueAt') {
    return dueSortDirectionPreference.value;
  }

  if (category === 'title') {
    return titleSortDirectionPreference.value;
  }

  return dateSortDirectionPreference.value;
};

const setSortDirectionPreference = (
  category: SortFieldOptionValue,
  direction: SortDirection,
) => {
  if (category === 'dueAt') {
    dueSortDirectionPreference.value = direction;

    if (import.meta.client) {
      localStorage.setItem(DUE_SORT_ORDER_STORAGE_KEY, direction);
    }
    return;
  }

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

  const storedDueOrder = localStorage.getItem(DUE_SORT_ORDER_STORAGE_KEY);
  if (storedDueOrder === 'asc' || storedDueOrder === 'desc') {
    dueSortDirectionPreference.value = storedDueOrder;
  }
};

const tabFilterPresets: Record<TabKey, DetailedFilterPreset> = {
  all: {
    targetingMe: false,
    administratedByMe: false,
    hasMyResponse: false,
    unansweredByMe: false,
    hasMyDraft: false,
    unpublishedOnly: false,
  },
  unanswered: {
    targetingMe: true,
    administratedByMe: false,
    hasMyResponse: false,
    unansweredByMe: true,
    hasMyDraft: false,
    unpublishedOnly: false,
  },
  answered: {
    targetingMe: false,
    administratedByMe: false,
    hasMyResponse: true,
    unansweredByMe: false,
    hasMyDraft: false,
    unpublishedOnly: false,
  },
  administered: {
    targetingMe: false,
    administratedByMe: true,
    hasMyResponse: false,
    unansweredByMe: false,
    hasMyDraft: false,
    unpublishedOnly: false,
  },
  draft: {
    targetingMe: false,
    administratedByMe: false,
    hasMyResponse: false,
    unansweredByMe: false,
    hasMyDraft: true,
    unpublishedOnly: false,
  },
};

const getQueryValue = (value: unknown): string | undefined => {
  if (Array.isArray(value)) {
    const first = value[0];
    return typeof first === 'string' ? first : undefined;
  }

  return typeof value === 'string' ? value : undefined;
};

const normalizeFilterQuery = (
  query: Record<string, string>,
  patch: Record<string, string | undefined>,
) => {
  const hasAnsweredUpdate = Object.hasOwn(patch, 'answered');
  const hasUnansweredUpdate = Object.hasOwn(patch, 'unanswered');
  const hasUnpublishedUpdate = Object.hasOwn(patch, 'unpublished');
  const hasAdminUpdate = Object.hasOwn(patch, 'admin');

  if (query.answered === '1' && query.unanswered === '1') {
    if (hasAnsweredUpdate && patch.answered === '1') {
      delete query.unanswered;
    } else if (hasUnansweredUpdate && patch.unanswered === '1') {
      delete query.answered;
    } else {
      delete query.unanswered;
    }
  }

  if (hasUnpublishedUpdate && query.unpublished === '1') {
    query.admin = '1';
  }

  if (hasAdminUpdate && query.admin !== '1') {
    delete query.unpublished;
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

  let nextQuery = { ...currentQuery };
  const keysToRemove = new Set<string>();
  Object.entries(patch).forEach(([key, value]) => {
    if (value === undefined) {
      keysToRemove.add(key);
      return;
    }

    nextQuery[key] = value;
  });

  if (keysToRemove.size > 0) {
    nextQuery = Object.fromEntries(
      Object.entries(nextQuery).filter(([key]) => !keysToRemove.has(key)),
    );
  }

  normalizeFilterQuery(nextQuery, patch);

  const currentEntries = Object.entries(currentQuery);
  const nextEntries = Object.entries(nextQuery);
  const changed =
    currentEntries.length !== nextEntries.length ||
    nextEntries.some(([key, value]) => currentQuery[key] !== value);
  const shouldClearHash = options.clearHash === true && route.hash.length > 0;

  if (!changed && !shouldClearHash) {
    return;
  }

  await router.replace({
    query: nextQuery,
    hash: shouldClearHash ? '' : route.hash,
  });
};

const resolveSortFromQuery = (): {
  category: SortCategory;
  reversed: boolean;
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
    reversed: direction === 'desc',
  };
};

const createBooleanQueryParam = (queryKey: string) => {
  return computed<boolean>({
    get: () => getQueryValue(route.query[queryKey] ?? undefined) === '1',
    set: (value) => {
      void setQueryParams({ [queryKey]: value ? '1' : undefined });
    },
  });
};

const searchText = computed<string>({
  get: () => getQueryValue(route.query.search) ?? '',
  set: (value) => {
    void setQueryParams({ search: value || undefined });
  },
});

const sortOption = computed<SortOptionValue>({
  get: (): SortOptionValue => {
    const { category, reversed } = resolveSortFromQuery();
    return `${category}:${reversed ? 'desc' : 'asc'}` as SortOptionValue;
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

const selectedSortCategory = computed<SortFieldOptionValue>(() =>
  isDueSortSelected.value ? 'dueAt' : sortCategory.value,
);

const selectedSortDirection = computed<SortDirection>(() =>
  selectedSortCategory.value === 'dueAt'
    ? dueSortDirectionPreference.value
    : sortDirection.value,
);

const isOrderSelectionDisabled = computed(
  () => selectedSortCategory.value === 'dueAt',
);

type SortMenuSnapshot = {
  sortOption: SortOptionValue;
  isDueSortSelected: boolean;
  dueSortDirection: SortDirection;
};

const sortMenuSnapshot = ref<SortMenuSnapshot | null>(null);

const setSortCategory = (category: SortCategory) => {
  const direction = getSortDirectionPreference(category);
  sortOption.value = `${category}:${direction}` as SortOptionValue;
};

const handleSortFieldSelection = (option: SortFieldOption) => {
  if (option.value === 'dueAt') {
    isDueSortSelected.value = true;
    return;
  }

  isDueSortSelected.value = false;
  setSortCategory(option.value as SortCategory);
};

const setSortDirection = (direction: SortDirection) => {
  if (selectedSortCategory.value === 'dueAt') {
    setSortDirectionPreference('dueAt', direction);
    return;
  }

  sortOption.value = `${sortCategory.value}:${direction}` as SortOptionValue;
};

const sortMenuLabel = computed(
  () =>
    `${sortFieldLabelMap[selectedSortCategory.value]} (${getSortDirectionLabel(selectedSortDirection.value, selectedSortCategory.value)})`,
);

const currentPage = computed<number>({
  get: () => {
    const rawPage = getQueryValue(route.query.page);
    const parsed = Number.parseInt(rawPage ?? '', 10);

    if (!Number.isFinite(parsed) || parsed < 1) {
      return 1;
    }

    return parsed;
  },
  set: (value) => {
    const normalized = Math.max(1, Math.floor(value));
    void setQueryParams({
      page: normalized === 1 ? undefined : String(normalized),
    });
  },
});

const onlyActiveDue = createBooleanQueryParam('due');
const isFilterExpanded = ref(false);
const isSortMenuOpen = ref(false);
const sortMenuRef = ref<HTMLElement | null>(null);
const filterTargetingMe = createBooleanQueryParam('targeting');
const filterAdministratedByMe = createBooleanQueryParam('admin');
const filterHasMyResponse = createBooleanQueryParam('answered');
const filterUnansweredByMe = createBooleanQueryParam('unanswered');
const filterHasMyDraft = createBooleanQueryParam('draft');
const filterUnpublishedOnly = createBooleanQueryParam('unpublished');

const applyTabPreset = async (
  tab: TabKey,
  options: SetQueryParamsOptions = {},
) => {
  const preset = tabFilterPresets[tab];
  await setQueryParams(
    {
      targeting: preset.targetingMe ? '1' : undefined,
      admin: preset.administratedByMe ? '1' : undefined,
      answered: preset.hasMyResponse ? '1' : undefined,
      unanswered: preset.unansweredByMe ? '1' : undefined,
      draft: preset.hasMyDraft ? '1' : undefined,
      unpublished: preset.unpublishedOnly ? '1' : undefined,
    },
    options,
  );
};

const resolveTabFromHash = (hash: string): TabKey | null => {
  const normalized = decodeURIComponent(hash.replace(/^#/, ''))
    .trim()
    .toLowerCase();

  return hashTabMap[normalized] ?? null;
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

const getCurrentDetailedFilterPreset = (): DetailedFilterPreset => {
  return {
    targetingMe: filterTargetingMe.value,
    administratedByMe: filterAdministratedByMe.value,
    hasMyResponse: filterHasMyResponse.value,
    unansweredByMe: filterUnansweredByMe.value,
    hasMyDraft: filterHasMyDraft.value,
    unpublishedOnly: filterUnpublishedOnly.value,
  };
};

const areEqualPreset = (
  left: DetailedFilterPreset,
  right: DetailedFilterPreset,
) => {
  return (
    left.targetingMe === right.targetingMe &&
    left.administratedByMe === right.administratedByMe &&
    left.hasMyResponse === right.hasMyResponse &&
    left.unansweredByMe === right.unansweredByMe &&
    left.hasMyDraft === right.hasMyDraft &&
    left.unpublishedOnly === right.unpublishedOnly
  );
};

const findTabFromDetailedFilters = (): TabKey | null => {
  const currentPreset = getCurrentDetailedFilterPreset();

  const matched = (
    Object.entries(tabFilterPresets) as [TabKey, DetailedFilterPreset][]
  ).find(([, preset]) => areEqualPreset(currentPreset, preset));

  return matched?.[0] ?? null;
};

const selectedTab = computed<TabKey | null>(() => findTabFromDetailedFilters());

const selectTab = (tab: TabKey) => {
  void applyTabPreset(tab);
};

const tabButtonRefs = ref<Partial<Record<TabKey, HTMLButtonElement>>>({});

const setTabButtonRef = (tabKey: TabKey, element: Element | null) => {
  if (element instanceof HTMLButtonElement) {
    tabButtonRefs.value[tabKey] = element;
    return;
  }

  tabButtonRefs.value[tabKey] = undefined;
};

const scrollTabIntoView = (tab: TabKey) => {
  const tabButton = tabButtonRefs.value[tab];
  if (!tabButton) {
    return;
  }

  tabButton.scrollIntoView({
    behavior: 'smooth',
    block: 'nearest',
    inline: 'center',
  });
};

const toApiSort = (
  option: SortOptionValue,
): components['schemas']['SortType'] => {
  if (option === 'title:asc') return 'title';
  if (option === 'title:desc') return '-title';
  if (option === 'modifiedAt:asc') return 'modified_at';
  if (option === 'modifiedAt:desc') return '-modified_at';
  if (option === 'createdAt:desc') return '-created_at';
  return 'created_at';
};

const apiQuery = computed<GetQuestionnairesOption>(() => {
  const trimmedSearch = searchText.value.trim();

  return {
    page: currentPage.value,
    search: trimmedSearch || undefined,
    sort: toApiSort(sortOption.value),
    onlyTargetingMe:
      filterTargetingMe.value || filterUnansweredByMe.value ? true : undefined,
    onlyAdministratedByMe: filterAdministratedByMe.value ? true : undefined,
    notOverDue:
      onlyActiveDue.value || filterUnansweredByMe.value ? true : undefined,
    hasMyResponse: filterHasMyResponse.value
      ? true
      : filterUnansweredByMe.value
        ? false
        : undefined,
    hasMyDraft: filterHasMyDraft.value ? true : undefined,
    isDraft: filterUnpublishedOnly.value
      ? true
      : filterUnansweredByMe.value
        ? false
        : undefined,
  };
});

const fetchQuestionnaireCount = async (option: GetQuestionnairesOption) => {
  const firstPage = await fetchQuestionnaires({
    ...option,
    page: 1,
  });

  const max = Math.max(1, firstPage.page_max ?? 1);
  if (max === 1) {
    return firstPage.questionnaires.length;
  }

  const lastPage = await fetchQuestionnaires({
    ...option,
    page: max,
  });

  return (max - 1) * PAGE_SIZE + lastPage.questionnaires.length;
};

const tabCountQueryBase = computed<GetQuestionnairesOption>(() => {
  const trimmedSearch = searchText.value.trim();

  return {
    search: trimmedSearch || undefined,
    notOverDue: onlyActiveDue.value ? true : undefined,
  };
});

const { data: tabCounts } = useAsyncData(
  () =>
    `/questionnaires/explorer/tab-counts?${JSON.stringify(tabCountQueryBase.value)}`,
  async () => {
    const [unanswered, all, answered, administered, draft] = await Promise.all([
      fetchQuestionnaireCount({
        ...tabCountQueryBase.value,
        onlyTargetingMe: true,
        hasMyResponse: false,
      }),
      fetchQuestionnaireCount({
        ...tabCountQueryBase.value,
      }),
      fetchQuestionnaireCount({
        ...tabCountQueryBase.value,
        hasMyResponse: true,
      }),
      fetchQuestionnaireCount({
        ...tabCountQueryBase.value,
        onlyAdministratedByMe: true,
      }),
      fetchQuestionnaireCount({
        ...tabCountQueryBase.value,
        hasMyDraft: true,
      }),
    ]);

    return {
      unanswered,
      all,
      answered,
      administered,
      draft,
    };
  },
  { watch: [tabCountQueryBase] },
);

const tabCount = (tab: TabKey) => tabCounts.value?.[tab] ?? 0;

const {
  data: questionnairePage,
  error,
  pending,
} = useAsyncData(
  () => `/questionnaires/explorer?${JSON.stringify(apiQuery.value)}`,
  () => fetchQuestionnaires(apiQuery.value),
  { watch: [apiQuery] },
);

const selectedTabForList = computed<TabKey>(() => selectedTab.value ?? 'all');

const displayedQuestionnaires = computed<QuestionnaireSummary[]>(() => {
  return questionnairePage.value?.questionnaires ?? [];
});

const sortedQuestionnaires = computed(() => displayedQuestionnaires.value);

const pageMax = computed(() => {
  return Math.max(1, questionnairePage.value?.page_max ?? 1);
});

const hashQuestionnaireIds = (ids: number[]) => {
  const MOD = 972663749;
  const BASE = 911382323;
  let hash = 0;

  for (const id of ids) {
    hash = (Math.imul(hash, BASE) + (id + 1)) % MOD;
  }

  return hash;
};

const paginatorTransitionKey = computed(() => {
  const ids = displayedQuestionnaires.value.map(
    (questionnaire) => questionnaire.questionnaire_id,
  );
  return `${currentPage.value}-${pageMax.value}-${ids.length}-${hashQuestionnaireIds(ids)}`;
});

const pagedQuestionnaires = computed(() => sortedQuestionnaires.value);
const totalRecordsForPaginator = computed(() => pageMax.value * PAGE_SIZE);

const explorerPageRef = ref<HTMLElement | null>(null);
const isHidingTab = ref(false);
let lastScrollY = 0;
let scrollContainer: HTMLElement | Window = window;

const handleScroll = () => {
  const currentScrollY =
    scrollContainer === window
      ? window.scrollY
      : (scrollContainer as HTMLElement).scrollTop;
  isHidingTab.value = currentScrollY > lastScrollY && currentScrollY > 64;
  lastScrollY = currentScrollY;
};

const scrollToTop = () => {
  if (scrollContainer === window) {
    window.scrollTo({ top: 0, behavior: 'auto' });
  } else {
    (scrollContainer as HTMLElement).scrollTo({ top: 0, behavior: 'auto' });
  }
  isHidingTab.value = false;
  lastScrollY = 0;
};

const toggleFilterExpanded = () => {
  isFilterExpanded.value = !isFilterExpanded.value;
};

const toggleSortMenu = () => {
  if (isSortMenuOpen.value) {
    closeSortMenu();
    return;
  }

  sortMenuSnapshot.value = {
    sortOption: sortOption.value,
    isDueSortSelected: isDueSortSelected.value,
    dueSortDirection: dueSortDirectionPreference.value,
  };
  isSortMenuOpen.value = true;
};

const closeSortMenu = () => {
  if (selectedSortCategory.value === 'dueAt' && sortMenuSnapshot.value) {
    sortOption.value = sortMenuSnapshot.value.sortOption;
    isDueSortSelected.value = sortMenuSnapshot.value.isDueSortSelected;
    setSortDirectionPreference(
      'dueAt',
      sortMenuSnapshot.value.dueSortDirection,
    );
  }

  sortMenuSnapshot.value = null;
  isSortMenuOpen.value = false;
};

const handleSortMenuOutsideClick = (event: MouseEvent) => {
  if (!isSortMenuOpen.value) {
    return;
  }

  const target = event.target;
  if (!(target instanceof Node)) {
    return;
  }

  if (sortMenuRef.value?.contains(target)) {
    return;
  }

  closeSortMenu();
};

const handlePageChange = (event: { page: number }) => {
  currentPage.value = event.page + 1;
  scrollToTop();
};

watch(selectedTab, (_tab, previousTab) => {
  if (previousTab !== undefined) {
    scrollToTop();
  }
});

watch(selectedTab, (tab) => {
  if (!tab) {
    return;
  }

  void nextTick(() => {
    scrollTabIntoView(tab);
  });
});

watch(
  [
    selectedTabForList,
    searchText,
    sortOption,
    onlyActiveDue,
    filterTargetingMe,
    filterAdministratedByMe,
    filterHasMyResponse,
    filterUnansweredByMe,
    filterHasMyDraft,
    filterUnpublishedOnly,
  ],
  () => {
    if (currentPage.value !== 1) {
      currentPage.value = 1;
    }
  },
);

watch(pageMax, (max) => {
  if (currentPage.value > max) {
    currentPage.value = max;
  }
});

onMounted(() => {
  restoreStoredSortDirectionPreferences();

  const hasDueQuery = getQueryValue(route.query.due) !== undefined;
  const storedDue = localStorage.getItem(ONLY_ACTIVE_DUE_STORAGE_KEY);
  if (!hasDueQuery && (storedDue === '0' || storedDue === '1')) {
    onlyActiveDue.value = storedDue === '1';
  }

  const candidate = explorerPageRef.value?.closest(
    'main',
  ) as HTMLElement | null;
  if (candidate) {
    scrollContainer = candidate;
  }

  const currentScrollY =
    scrollContainer === window
      ? window.scrollY
      : (scrollContainer as HTMLElement).scrollTop;
  lastScrollY = currentScrollY;
  scrollContainer.addEventListener('scroll', handleScroll, { passive: true });
  document.addEventListener('mousedown', handleSortMenuOutsideClick);
});

watch(onlyActiveDue, (value) => {
  localStorage.setItem(ONLY_ACTIVE_DUE_STORAGE_KEY, value ? '1' : '0');
});

onBeforeUnmount(() => {
  scrollContainer.removeEventListener('scroll', handleScroll);
  document.removeEventListener('mousedown', handleSortMenuOutsideClick);
});
</script>

<template>
  <div ref="explorerPageRef" class="explorer-page">
    <div v-if="error" class="state-box is-error">
      <p>アンケート一覧の取得に失敗しました。</p>
      <p>{{ error.message }}</p>
    </div>

    <div v-else-if="pending && !questionnairePage" class="state-box">
      <p>アンケートを読み込み中...</p>
    </div>

    <div v-else class="content">
      <div class="tab-row" :class="{ hiding: isHidingTab }">
        <button
          v-for="tab in tabs"
          :key="tab.key"
          :ref="
            (element) => setTabButtonRef(tab.key, element as Element | null)
          "
          type="button"
          class="tab-button"
          :class="{ active: selectedTab === tab.key }"
          @click="selectTab(tab.key)"
        >
          {{ tab.label }}
          <span class="tab-count">({{ tabCount(tab.key) }})</span>
        </button>
      </div>

      <div
        class="filter-row"
        :class="{ expanded: isFilterExpanded }"
        role="button"
        tabindex="0"
        @click="toggleFilterExpanded"
        @keydown.enter.prevent="toggleFilterExpanded"
        @keydown.space.prevent="toggleFilterExpanded"
      >
        <div class="filter-prefix">
          <span class="filter-arrow">
            <Icon name="mdi:chevron-down" size="18px" />
          </span>
          フィルタ
        </div>

        <div ref="sortMenuRef" class="summary-control sort-menu" @click.stop>
          <button
            type="button"
            class="sort-menu-trigger"
            aria-haspopup="menu"
            :aria-expanded="isSortMenuOpen"
            @click="toggleSortMenu"
            @keydown.esc.prevent="closeSortMenu"
          >
            <span class="sort-menu-trigger-label">並べ方</span>
            <span class="sort-menu-trigger-current">{{ sortMenuLabel }}</span>
            <Icon
              name="mdi:chevron-down"
              size="16px"
              :class="['sort-menu-trigger-chevron', { open: isSortMenuOpen }]"
            />
          </button>

          <div v-if="isSortMenuOpen" class="sort-menu-panel" role="menu">
            <section class="sort-menu-section" aria-label="並べ替え項目">
              <h3 class="sort-menu-title">Sort by</h3>
              <button
                v-for="option in sortFieldOptions"
                :key="option.value"
                type="button"
                class="sort-menu-item"
                :class="{
                  selected: selectedSortCategory === option.value,
                  'is-visual-disabled': option.visualDisabled,
                }"
                role="menuitemradio"
                :aria-checked="selectedSortCategory === option.value"
                @click="handleSortFieldSelection(option)"
              >
                <Icon
                  name="mdi:check"
                  size="16px"
                  class="sort-menu-check"
                  :class="{ visible: selectedSortCategory === option.value }"
                />
                <span>{{ option.label }}</span>
              </button>
            </section>

            <section class="sort-menu-section" aria-label="並び順">
              <h3 class="sort-menu-title">Order</h3>
              <button
                v-for="option in sortDirectionOptions"
                :key="option"
                type="button"
                class="sort-menu-item"
                :class="{
                  selected: selectedSortDirection === option,
                  'is-visual-disabled': isOrderSelectionDisabled,
                }"
                role="menuitemradio"
                :aria-disabled="isOrderSelectionDisabled"
                :aria-checked="selectedSortDirection === option"
                @click="setSortDirection(option)"
              >
                <Icon
                  name="mdi:check"
                  size="16px"
                  class="sort-menu-check"
                  :class="{ visible: selectedSortDirection === option }"
                />
                <Icon
                  :name="getSortDirectionIcon(option, selectedSortCategory)"
                  size="22px"
                  class="sort-menu-order-icon"
                />
                <span>
                  {{ getSortDirectionLabel(option, selectedSortCategory) }}
                </span>
              </button>
            </section>
          </div>
        </div>

        <div class="due-toggle" @click.stop>
          <label for="toggle-active-due">期限内のみ</label>
          <ToggleSwitch id="toggle-active-due" v-model="onlyActiveDue" />
        </div>
      </div>

      <Transition name="filter-expand">
        <div v-if="isFilterExpanded" class="advanced-filter-panel" @click.stop>
          <div class="mobile-filter-search search-field-with-icon">
            <Icon class="search-icon" name="mdi:magnify" size="20px" />
            <InputText
              v-model="searchText"
              placeholder="タイトル・説明を検索"
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
              <label class="advanced-switch-item" for="advanced-unpublished">
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
      </Transition>

      <div class="filter-bottom-spacer" />

      <Transition
        name="paginator-switch"
        mode="out-in"
        class="paginator-container"
      >
        <Paginator
          v-if="sortedQuestionnaires.length > 0"
          :key="paginatorTransitionKey"
          class="paginator"
          :first="(currentPage - 1) * PAGE_SIZE"
          :rows="PAGE_SIZE"
          :total-records="totalRecordsForPaginator"
          template="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink"
          @page="handlePageChange"
        />

        <div v-else class="state-box">
          <p>条件に一致するアンケートはありません。</p>
        </div>
      </Transition>

      <QuestionnaireList :questionnaires="pagedQuestionnaires" />

      <Transition
        name="paginator-switch"
        mode="out-in"
        class="paginator-container paginator-container-bottom"
      >
        <Paginator
          v-if="sortedQuestionnaires.length > 0"
          class="paginator"
          :first="(currentPage - 1) * PAGE_SIZE"
          :rows="PAGE_SIZE"
          :total-records="totalRecordsForPaginator"
          template="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink"
          @page="handlePageChange"
        />
      </Transition>
    </div>
  </div>
</template>

<style scoped lang="scss">
.explorer-page {
  width: 100%;
}

.content {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.tab-row {
  position: sticky;
  top: 0;
  z-index: 99;
  isolation: isolate;
  display: flex;
  flex-wrap: nowrap;
  align-items: center;
  gap: 8px;
  overflow-x: auto;
  overflow-y: hidden;
  -webkit-overflow-scrolling: touch;
  border-bottom: 1px solid var(--p-surface-300);
  padding: 10px 0;
  background-color: var(--p-surface-0);
  transition: transform 0.3s cubic-bezier(0.2, 0, 0, 1);
}

.tab-row::before {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  top: -3px;
  height: 3px;
  background-color: var(--p-surface-0);
  pointer-events: none;
}

.tab-row.hiding {
  transform: translateY(calc(-100% - 3px));
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
  transition:
    background-color 0.2s ease,
    color 0.2s ease;
}

.tab-button.active {
  background-color: color-mix(in srgb, variables.$color-primary 15%, white);
  color: variables.$color-primary;
}

.tab-count {
  color: var(--p-text-secondary);
}

.filter-row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 12px;
  padding: 12px;
  border: 1px solid var(--p-surface-300);
  border-radius: var(--p-border-radius-md);
  background-color: var(--p-surface-50);
}

.filter-row.expanded {
  border-bottom-left-radius: 0;
  border-bottom-right-radius: 0;
}

.summary-control {
  min-width: 180px;
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
  transition: transform 0.2s ease;
}

.sort-menu-trigger-chevron.open {
  transform: rotate(180deg);
}

.sort-menu-panel {
  position: absolute;
  top: calc(100% + 8px);
  left: 0;
  z-index: 20;
  min-width: 250px;
  border: 1px solid var(--p-surface-300);
  border-radius: var(--p-border-radius-md);
  background-color: var(--p-surface-0);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  overflow: hidden;
}

.sort-menu-section + .sort-menu-section {
  border-top: 1px solid var(--p-surface-300);
}

.sort-menu-title {
  margin: 0;
  padding: 10px 12px 6px;
  font-size: 12px;
  color: var(--p-text-secondary);
  font-weight: 700;
}

.sort-menu-item {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 8px;
  border: none;
  background-color: transparent;
  color: var(--p-text-color);
  padding: 8px 12px;
  text-align: left;
  cursor: pointer;
}

.sort-menu-item:hover {
  background-color: var(--p-surface-100);
}

.sort-menu-item:disabled {
  opacity: 0.55;
  cursor: not-allowed;
}

.sort-menu-item:disabled:hover {
  background-color: transparent;
}

.sort-menu-item.selected {
  font-weight: 600;
}

.sort-menu-item.is-visual-disabled,
.sort-menu-item.is-visual-disabled.selected {
  color: var(--p-surface-400);
}

.sort-menu-check {
  opacity: 0;
}

.sort-menu-check.visible {
  opacity: 1;
}

.sort-menu-order-icon {
  color: var(--p-text-secondary);

  &.is-desc {
    transform: scaleY(-1);
  }
}

.sort-menu-item.selected .sort-menu-order-icon {
  color: var(--p-text-color);
}

.advanced-filter-panel {
  margin-top: -16px;
  border: 1px solid var(--p-surface-300);
  border-top: none;
  border-bottom-left-radius: var(--p-border-radius-md);
  border-bottom-right-radius: var(--p-border-radius-md);
  padding: 14px 12px 12px;
  background-color: var(--p-surface-0);
}

.mobile-filter-search {
  display: none;
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

.filter-expand {
  &-enter-active,
  &-leave-active {
    transition:
      max-height 0.25s ease,
      opacity 0.2s ease,
      transform 0.25s ease;
  }

  &-enter-from,
  &-leave-to {
    max-height: 0;
    opacity: 0;
    transform: translateY(-8px);
  }

  &-enter-to,
  &-leave-from {
    max-height: 800px;
    opacity: 1;
    transform: translateY(0);
  }
}

.tab-switch {
  &-enter-active,
  &-leave-active {
    transition:
      opacity 0.2s ease,
      transform 0.2s ease;
  }

  &-enter-from,
  &-leave-to {
    opacity: 0;
    transform: translateY(8px);
  }

  &-enter-to,
  &-leave-from {
    opacity: 1;
    transform: translateY(0);
  }
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

.advanced-input,
.advanced-select {
  width: 100%;
}

.advanced-filter-footer {
  display: flex;
  justify-content: flex-end;
  margin-top: 10px;
}

.filter-prefix {
  font-size: 14px;
  color: var(--p-text-secondary);
  font-weight: 700;
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

.filter-arrow {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.3s ease;
}

.filter-row.expanded .filter-arrow {
  transform: rotate(180deg);
}

.sort-select {
  min-width: 180px;
}

.due-toggle {
  margin-left: auto;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
}

.paginator-container {
  margin-top: 4px;
  height: 4rem;
}

.paginator-container-bottom {
  margin-top: 0;
}

.paginator-switch {
  &-enter-active,
  &-leave-active {
    transition:
      opacity 0.18s ease,
      transform 0.18s ease;
  }

  &-enter-from,
  &-leave-to {
    opacity: 0;
    transform: translateY(-4px);
  }
}

.state-box {
  border: 1px solid var(--p-surface-300);
  border-radius: var(--p-border-radius-md);
  padding: 20px;
  text-align: center;
  color: var(--p-text-secondary);
}

.state-box.is-error {
  border-color: var(--p-red-300);
  color: var(--p-red-900);
}

@media screen and (max-width: 900px) {
  .mobile-filter-search {
    display: block;
    margin-bottom: 12px;
  }

  .advanced-filter-grid {
    grid-template-columns: 1fr;
  }
}

@media screen and (max-width: 560px) {
  .sort-menu-panel {
    left: auto;
    right: 0;
    min-width: 220px;
  }

  .due-toggle {
    margin-left: 0;
  }
}
</style>
