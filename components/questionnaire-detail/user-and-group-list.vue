<script lang="ts" setup>
import GroupList from './group-list.vue';
import UserList from './user-list.vue';

const props = defineProps<{
  specifier: { users: string[]; groups: string[] };
  actualUsers: string[];
  userDialogTitle?: string;
  groupDialogTitle?: string;
}>();

const { restUsers, groups } = useResolveUserSpecifier(
  props.specifier,
  props.actualUsers,
);
</script>

<template>
  <div class="user-and-group-list">
    <GroupList :groups="groups" :dialog-title="props.groupDialogTitle" />
    <UserList :users="restUsers" :dialog-title="props.userDialogTitle" />
  </div>
</template>

<style lang="scss" scoped>
.user-and-group-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
</style>
