import type {
  ExplorerFilterPayload,
  TabKey,
} from '~/components/explorer/filter-types';
import {
  fetchQuestionnaires,
  type GetQuestionnairesOption,
} from '~/composables/type-fetch/anke-to/client';
import { EXPLORER_PAGE_SIZE } from './use-explorer-questionnaires';

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

  return (max - 1) * EXPLORER_PAGE_SIZE + lastPage.questionnaires.length;
};

export const useExplorerTabCounts = ({
  activeFilterPayload,
}: {
  activeFilterPayload: Ref<ExplorerFilterPayload>;
}) => {
  const tabCountWatchKey = computed(() =>
    JSON.stringify(activeFilterPayload.value.tabCountQuery),
  );

  const { data: tabCounts, pending: tabCountsLoading } = useAsyncData(
    () =>
      `/questionnaires/explorer/tab-counts?${JSON.stringify(activeFilterPayload.value.tabCountQuery)}`,
    async () => {
      const base = activeFilterPayload.value.tabCountQuery;

      const [unanswered, all, answered, administered, draft] =
        await Promise.all([
          fetchQuestionnaireCount({
            ...base,
            onlyTargetingMe: true,
            hasMyResponse: false,
          }),
          fetchQuestionnaireCount({
            ...base,
          }),
          fetchQuestionnaireCount({
            ...base,
            hasMyResponse: true,
          }),
          fetchQuestionnaireCount({
            ...base,
            onlyAdministratedByMe: true,
          }),
          fetchQuestionnaireCount({
            ...base,
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
    { watch: [tabCountWatchKey] },
  );

  const normalizedTabCounts = computed<
    Partial<Record<TabKey, number | string>>
  >(() => {
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
