import type { GetQuestionnairesOption } from "~/composables/type-fetch/anke-to/client";
import type {
  SortCategory,
  SortDirection,
  SortFieldOption,
} from "./filter-types";

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
  category: SortCategory,
  direction: SortDirection,
): NonNullable<GetQuestionnairesOption>["sort"] => {
  if (category === "title") {
    return direction === "asc" ? "title" : "-title";
  }

  if (category === "modifiedAt") {
    return direction === "asc" ? "modified_at" : "-modified_at";
  }

  if (category === "createdAt" && direction === "desc") {
    return "-created_at";
  }

  return "created_at";
};
