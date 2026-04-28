<script lang="ts" setup>
import GroupList from './group-list.vue';
import UserList from './user-list.vue';
import NoContentMessage from '~/components/ui/no-content-message.vue';

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
    <div v-if="groups.length === 0 && restUsers.length === 0">
      <NoContentMessage>いません</NoContentMessage>
    </div>
    <GroupList
      v-if="groups.length > 0"
      :groups="groups"
      :dialog-title="props.groupDialogTitle"
    />
    <UserList
      v-if="restUsers.length > 0"
      :users="restUsers"
      :dialog-title="props.userDialogTitle"
    />
  </div>
</template>

<style lang="scss" scoped>
.user-and-group-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
</style>
