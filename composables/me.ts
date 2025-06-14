import { useFetchTraqApi } from "~/composables/type-fetch/traq/use-fetch-traq-api";

export const useMe = async () => {
  const { data: me } = await useFetchTraqApi("/users/me");
  return me;
};
