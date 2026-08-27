import type { ExplorerFilterPayload, TabKey } from '~/components/explorer/filter-types';
import { fetchQuestionnaires, type GetQuestionnairesOption } from '~/composables/type-fetch/anke-to/client';

const fetchQuestionnaireCount = async (option: GetQuestionnairesOption, signal: AbortSignal) => {
  const firstPage = await fetchQuestionnaires(option, signal);

  return firstPage.total_records;
};

export const useExplorerTabCounts = ({ activeFilterPayload }: { activeFilterPayload: Ref<ExplorerFilterPayload> }) => {
  const tabCountWatchKey = computed(() => JSON.stringify(activeFilterPayload.value.tabCountQuery));
  let scheduledQuery: GetQuestionnairesOption = {};

  const {
    data: tabCounts,
    pending: tabCountsPending,
    execute: loadTabCounts,
  } = useAsyncData(
    '/questionnaires/explorer/tab-counts',
    async (_nuxtApp, { signal }) => {
      const base = { ...scheduledQuery };

      const [unanswered, all, answered, administered, draft] = await Promise.all([
        fetchQuestionnaireCount(
          {
            ...base,
            onlyTargetingMe: true,
            hasMyResponse: false,
          },
          signal,
        ),
        fetchQuestionnaireCount({ ...base }, signal),
        fetchQuestionnaireCount({ ...base, hasMyResponse: true }, signal),
        fetchQuestionnaireCount({ ...base, onlyAdministratedByMe: true }, signal),
        fetchQuestionnaireCount({ ...base, hasMyDraft: true }, signal),
      ]);

      return {
        unanswered,
        all,
        answered,
        administered,
        draft,
      };
    },
    { immediate: false },
  );

  const tabCountsQueued = ref(true);
  const tabCountsLoading = computed(() => tabCountsQueued.value || tabCountsPending.value);
  let tabCountTimer: ReturnType<typeof setTimeout> | undefined;

  const scheduleTabCountLoad = () => {
    tabCountsQueued.value = true;
    if (tabCountTimer !== undefined) {
      clearTimeout(tabCountTimer);
    }

    // Counts are useful context, but the questionnaire list is the content the
    // user came for. Give its request a head start and coalesce filter changes.
    tabCountTimer = setTimeout(async () => {
      scheduledQuery = { ...activeFilterPayload.value.tabCountQuery };
      try {
        await loadTabCounts({ dedupe: 'cancel' });
      } finally {
        tabCountsQueued.value = false;
      }
    }, 500);
  };

  watch(tabCountWatchKey, scheduleTabCountLoad);
  onMounted(scheduleTabCountLoad);
  onBeforeUnmount(() => {
    if (tabCountTimer !== undefined) {
      clearTimeout(tabCountTimer);
    }
  });

  const normalizedTabCounts = computed<Partial<Record<TabKey, number | string>>>(() => {
    if (tabCountsLoading.value) {
      return {
        unanswered: '?',
        all: '?',
        answered: '?',
        administered: '?',
        draft: '?',
      };
    }

    return {
      unanswered: tabCounts.value?.unanswered ?? 0,
      all: tabCounts.value?.all ?? 0,
      answered: tabCounts.value?.answered ?? 0,
      administered: tabCounts.value?.administered ?? 0,
      draft: tabCounts.value?.draft ?? 0,
    };
  });

  return {
    normalizedTabCounts,
    tabCountsLoading,
  };
};
