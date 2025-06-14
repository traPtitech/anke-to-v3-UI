import { useFetchTraqApi } from "~/composables/type-fetch/traq/use-fetch-traq-api";

export const useTraqId = async () => {
  const { data: users } = await useFetchTraqApi("/users");
  const traqIdToUserIdMap = new Map<string, string>();
  const userIdToTraqIdMap = new Map<string, string>();

  if (users.value !== null) {
    for (const user of users.value) {
      traqIdToUserIdMap.set(user.name, user.id);
      userIdToTraqIdMap.set(user.id, user.name);
    }
  }

  const getUserIDFromTraqID = (traqID: string) => {
    if (users.value === null) return undefined;
    return traqIdToUserIdMap.get(traqID);
  };

  const getTraqIDFromUserID = (userID: string) => {
    if (users.value === null) return undefined;
    return userIdToTraqIdMap.get(userID);
  };

  return {
    getUserIDFromTraqID,
    getTraqIDFromUserID,
  };
};
