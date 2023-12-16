export const useResolveUserSpecifier = (
  specifier: {
    users: string[];
    groups: string[];
  },
  functions: {
    getGroupMembersFromGroupID: (groupID: string) => string[] | undefined;
    getGroupNameFromUserID: (userID: string) => string | undefined;
    getTraqIDFromUserID: (userID: string) => string | undefined;
  },
) => {
  const {
    getGroupMembersFromGroupID,
    getGroupNameFromUserID,
    getTraqIDFromUserID,
  } = functions;

  const excludeFalsy = <T>(array: (T | undefined | null)[]): T[] => {
    return array.filter((item) => item) as T[];
  };

  const users = computed(() => {
    const _groupMemberIds = specifier.groups.flatMap((group) =>
      getGroupMembersFromGroupID(group),
    );
    const groupMemberIds = excludeFalsy(_groupMemberIds);
    const _groupMemberNames = groupMemberIds.map((id) =>
      getTraqIDFromUserID(id),
    );
    const groupMemberNames = excludeFalsy(_groupMemberNames);

    const users = [...specifier.users, ...groupMemberNames];

    const uniqueUsers = [...new Set(users)];

    return uniqueUsers;
  });

  const groups = computed(() => {
    const _groupNames = specifier.groups.map((group) =>
      getGroupNameFromUserID(group),
    );
    const groupNames = excludeFalsy(_groupNames);
    return groupNames;
  });

  return {
    users,
    groups,
  };
};
