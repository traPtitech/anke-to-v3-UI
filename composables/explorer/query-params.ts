export const explorerQueryKeys = {
  filter: 'filter',
  search: 'search',
  sort: 'sort',
  reversed: 'reversed',
  page: 'page',
} as const;

export const explorerLegacyFilterQueryKeys = [
  'targeting',
  'admin',
  'answered',
  'unanswered',
  'draft',
  'unpublished',
  'due',
  'onlyTargetingMe',
  'isDraft',
] as const;

export const questionnaireDetailQueryKeys = {
  tab: 'tab',
} as const;

export const questionnaireDetailTabValues = {
  questions: 'questions',
} as const;
