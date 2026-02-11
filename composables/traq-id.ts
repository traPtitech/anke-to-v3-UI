import { useUsers } from "~/composables/type-fetch/anke-to/client";

export const useTraqId = () => {
  const { data: users } = useUsers();
  const traqIdToUserIdMap = new Map<string, string>();
  const userIdToTraqIdMap = new Map<string, string>();

  for (const user of users.value ?? []) {
    traqIdToUserIdMap.set(user.name, user.id);
    userIdToTraqIdMap.set(user.id, user.name);
  }

  const getUserIDFromTraqID = (traqID: string) => {
    return traqIdToUserIdMap.get(traqID);
  };

  const getTraqIDFromUserID = (userID: string) => {
    return userIdToTraqIdMap.get(userID);
  };

  return {
    getUserIDFromTraqID,
    getTraqIDFromUserID,
  };
};
