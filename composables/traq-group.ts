import { useGroups } from "~/composables/type-fetch/anke-to/client";

export const useTraqGroup = () => {
  const { data: groups } = useGroups();

  const getGroupNameFromGroupID = (groupID: string) => {
    const group = groups.value?.find((group) => group.id === groupID);
    const groupName = group?.name;
    return groupName;
  };

  const getGroupMembersFromGroupID = (groupID: string) => {
    const group = groups.value?.find((group) => group.id === groupID);
    const members = group?.members.map((member) => member.id);

    return members;
  };

  return {
    getGroupNameFromGroupID,
    getGroupMembersFromGroupID,
  };
};
