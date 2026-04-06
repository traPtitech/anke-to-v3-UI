import type { GetQuestionnairesOption } from "~/composables/type-fetch/anke-to/client";
import type {
  SortCategory,
  SortDirection,
  SortFieldOption,
  SortOptionValue,
} from "./filter-types";

export const DATE_SORT_ORDER_STORAGE_KEY = "explorer.sortOrder.date";
export const TITLE_SORT_ORDER_STORAGE_KEY = "explorer.sortOrder.title";

export const DEFAULT_SORT_OPTION: SortOptionValue = "createdAt:desc";

export const sortFieldOptions: SortFieldOption[] = [
  { label: "作成日時", value: "createdAt" },
  { label: "更新日時", value: "modifiedAt" },
  { label: "タイトル", value: "title" },
];

export const sortDirectionOptions: SortDirection[] = ["asc", "desc"];

const sortFieldLabelMap: Record<SortCategory, string> = {
  createdAt: "作成日時",
  modifiedAt: "更新日時",
  title: "タイトル",
};

const defaultSortDirectionLabelMap: Record<SortDirection, string> = {
  asc: "昇順",
  desc: "降順",
};

const dateSortDirectionLabelMap: Record<SortDirection, string> = {
  asc: "古い順",
  desc: "新しい順",
};

export const isSortCategory = (value: string): value is SortCategory => {
  return value === "createdAt" || value === "modifiedAt" || value === "title";
};

export const getSortDirectionLabel = (
  direction: SortDirection,
  category: SortCategory,
): string => {
  if (category === "createdAt" || category === "modifiedAt") {
    return dateSortDirectionLabelMap[direction];
  }

  return defaultSortDirectionLabelMap[direction];
};

export const getSortDirectionIcon = (
  direction: SortDirection,
  category: SortCategory,
): string => {
  if (category === "createdAt" || category === "modifiedAt") {
    return `mdi:sort-clock-${direction}ending-outline`;
  }

  return `mdi:sort-alphabetical-${direction}ending`;
};

export const buildSortMenuLabel = (
  category: SortCategory,
  direction: SortDirection,
): string => {
  return `${sortFieldLabelMap[category]} (${
    getSortDirectionLabel(direction, category)
  })`;
};

export const toApiSort = (
  option: SortOptionValue,
): NonNullable<GetQuestionnairesOption>["sort"] => {
  if (option === "title:asc") return "title";
  if (option === "title:desc") return "-title";
  if (option === "modifiedAt:asc") return "modified_at";
  if (option === "modifiedAt:desc") return "-modified_at";
  if (option === "createdAt:desc") return "-created_at";
  return "created_at";
};
