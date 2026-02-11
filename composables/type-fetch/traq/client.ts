import createClient from "openapi-fetch";
import type { paths } from "./openapi";
import { useFetchTraqApi } from "./use-fetch-traq-api";

export const useTraqClient = () => {
  const { state } = useTraqAuthStore();

  const client = createClient<paths>({
    baseUrl: "https://q.trap.jp/api/v3",
    headers: {
      Authorization: `Bearer ${state.accessToken ?? ""}`,
    },
  });

  return { client };
};

export const useMe = () => useFetchTraqApi("/users/me");

export const useUsers = () => useFetchTraqApi("/users");

export const useGroups = () => useFetchTraqApi("/groups");

export const useStamps = () => useFetchTraqApi("/stamps");

export const useChannels = () => useFetchTraqApi("/channels");
