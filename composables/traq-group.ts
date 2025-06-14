import { useFetchTraqApi } from "~/composables/type-fetch/traq/use-fetch-traq-api";

export const useTraqGroup = async () => {
  const { data: groups } = await useFetchTraqApi("/groups");

  const getGroupNameFromGroupID = (groupID: string) => {
    if (groups.value === null) return undefined;

    const group = groups.value.find((group) => group.id === groupID);
    const groupName = group?.name;
    return groupName;
  };

  const getGroupMembersFromGroupID = (groupID: string) => {
    if (groups.value === null) return undefined;

    const group = groups.value.find((group) => group.id === groupID);
    const members = group?.members.map((member) => member.id);

    return members;
  };

  return {
    getGroupNameFromGroupID,
    getGroupMembersFromGroupID,
  };
};
