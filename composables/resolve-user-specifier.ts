export const useResolveUserSpecifier = (
  specifier: {
    users: string[];
    groups: string[];
  },
  actualUsers: string[],
) => {
  const { getGroupMembersFromGroupID, getGroupNameFromGroupID } =
    useTraqGroup();
  const { getTraqIDFromUserID } = useTraqId();

  // どのグループにも所属していないユーザー
  const restUsers = computed(() => {
    const _groupMemberIds = specifier.groups.flatMap((group) =>
      getGroupMembersFromGroupID(group)
    );
    const groupMemberIds = excludeFalsy(_groupMemberIds);
    const _groupMemberNames = groupMemberIds.map((id) =>
      getTraqIDFromUserID(id)
    );
    const groupMemberNames = excludeFalsy(_groupMemberNames);
    const groupMemberNamesSet = new Set(groupMemberNames);

    return actualUsers
      .filter((user) => !groupMemberNamesSet.has(user));
  });

  const groups = computed(() => {
    const groups = specifier.groups.map((group) => {
      const name = getGroupNameFromGroupID(group);
      if (name === undefined) return undefined;

      const members = getGroupMembersFromGroupID(group);
      if (members === undefined) return undefined;

      const _membersNames = members.map((id) => getTraqIDFromUserID(id));
      const membersNames = excludeFalsy(_membersNames);

      return {
        name,
        members: membersNames,
      };
    });
    return excludeFalsy(groups);
  });

  return {
    restUsers,
    groups,
  };
};
