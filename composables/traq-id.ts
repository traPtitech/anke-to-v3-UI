import { useFetchTraqApi } from '~/composables/type-fetch/traq/use-fetch-traq-api';

export const useTraqId = async () => {
  const { data: users } = await useFetchTraqApi('/users');

  const getUserIDFromTraqID = (traqID: string) => {
    if (users.value === null) return undefined;

    const user = users.value.find((user) => user.name === traqID);
    const userID = user?.id;
    return userID;
  };

  return {
    getUserIDFromTraqID,
  };
};
