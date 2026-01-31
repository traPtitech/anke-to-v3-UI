<script lang="ts" setup>
import GroupList from './group-list.vue';
import UserList from './user-list.vue';

const props = defineProps<{
  specifier: { users: string[]; groups: string[] };
  actualUsers: string[];
}>();

const { restUsers, groups } = await useResolveUserSpecifier(
  props.specifier,
  props.actualUsers,
);
</script>

<template>
  <div>
    <GroupList :groups="groups" />
    <UserList :users="restUsers" />
  </div>
</template>

<style lang="scss" scoped></style>
