import type { GetQuestionnairesOption } from "~/composables/type-fetch/anke-to/client";

export type QuestionnairesQuery = NonNullable<GetQuestionnairesOption>;

export type TabKey =
  | "unanswered"
  | "all"
  | "answered"
  | "administered"
  | "draft";

export type FilterKey =
  | "targeting"
  | "administered"
  | "answered"
  | "unanswered"
  | "draft"
  | "unpublished";

export type SortCategory = "createdAt" | "modifiedAt" | "title";

export type SortDirection = "asc" | "desc";

export type SortOptionValue = `${SortCategory}:${SortDirection}`;

export type SortFieldOption = {
  label: string;
  value: SortCategory;
  visualDisabled?: boolean;
};

export type ExplorerTabItem = {
  key: TabKey;
  label: string;
};

export type ExplorerFilterPayload = {
  signature: string;
  listQuery: Omit<QuestionnairesQuery, "page">;
  tabCountQuery: Partial<Pick<QuestionnairesQuery, "search" | "notOverDue">>;
};
