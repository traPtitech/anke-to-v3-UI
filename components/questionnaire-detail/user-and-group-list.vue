<script lang="ts" setup>
const props = defineProps<{
  specifier: { users: string[]; groups: string[] };
}>();

const { getGroupMembersFromGroupID, getGroupNameFromUserID } =
  await useTraqGroup();
const { getTraqIDFromUserID } = await useTraqId();

const { users, groups } = await useResolveUserSpecifier(props.specifier, {
  getGroupMembersFromGroupID,
  getGroupNameFromUserID,
  getTraqIDFromUserID,
});

const groupString = computed(() =>
  groups.value.map((group) => '@' + group).join(' '),
);
</script>

<template>
  <div>
    <UserList :users="users" />
    <span v-if="groupString !== ''">
      {{ `(${groupString})` }}
    </span>
  </div>
</template>

<style lang="scss" scoped></style>
