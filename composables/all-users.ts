import { useUsers } from "~/composables/type-fetch/anke-to/client";

export const useAllUsers = () => {
  const { data: users } = useUsers();

  const allUserNames = computed(() => {
    return users.value?.filter((user) => !user.is_bot).map((user) =>
      user.name
    ) ?? [];
  });

  return {
    allUserNames,
  };
};
