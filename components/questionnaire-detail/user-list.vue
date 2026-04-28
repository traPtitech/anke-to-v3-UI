<script lang="ts" setup>
import { computed, ref } from 'vue';
import { useMe } from '~/composables/type-fetch/anke-to/client';
import UserChip from '~/components/ui/user-chip.vue';

const props = defineProps<{
  users: string[];
  dialogTitle?: string;
}>();

const MAX_VISIBLE_USERS = 14;

const { data: me } = useMe();
const isDialogVisible = ref(false);

const userCounts = computed(() => {
  const counts = new Map<string, number>();
  for (const user of props.users) {
    counts.set(user, (counts.get(user) ?? 0) + 1);
  }
  const entries = Array.from(counts.entries());
  // Sort so that if 'me.name' is a user, it appears first
  return entries.sort(([userA], [userB]) => {
    if (userA === me.value?.name) return -1;
    if (userB === me.value?.name) return 1;
    return 0;
  });
});

const visibleUserCounts = computed(() => userCounts.value.slice(0, MAX_VISIBLE_USERS));

const hiddenUserCount = computed(() => userCounts.value.length - visibleUserCounts.value.length);
</script>

<template>
  <div class="user-list-wrapper">
    <div class="user-chip-list">
      <UserChip
        v-for="[user, count] in visibleUserCounts"
        :key="user"
        :username="user"
        :count="count"
        :highlighted="me?.name === user"
      />

      <button v-if="hiddenUserCount > 0" type="button" class="user-chip-more" @click="isDialogVisible = true">
        +{{ hiddenUserCount }}
      </button>
    </div>

    <Dialog
      v-model:visible="isDialogVisible"
      modal
      dismissable-mask
      :header="props.dialogTitle ?? 'ユーザー一覧'"
      :style="{ width: 'min(720px, 92vw)' }"
    >
      <div class="dialog-user-list">
        <div
          v-for="[user, count] in userCounts"
          :key="`dialog-${user}`"
          class="dialog-user-item"
          :class="{ 'dialog-user-item-me': me?.name === user }"
        >
          <img class="dialog-user-avatar" :src="getUserAvatarUrl(user)" aria-hidden="true" />
          <span class="dialog-user-name">{{ '@' + user }}</span>
          <span v-if="count > 1" class="dialog-user-count">({{ count }})</span>
        </div>
      </div>
    </Dialog>
  </div>
</template>

<style lang="scss" scoped>
.user-list-wrapper {
  width: 100%;
}

.user-chip-list {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  width: 100%;
}

.user-chip-more {
  border: 1px dashed var(--p-surface-400);
  border-radius: 999px;
  background-color: var(--p-surface-0);
  color: var(--p-text-secondary);
  padding: 3px 10px;
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;
}

.user-chip-more:hover {
  background-color: var(--p-surface-100);
}

.dialog-user-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 8px;
  max-height: min(65vh, 520px);
  overflow-y: auto;
}

.dialog-user-item {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  border: 1px solid var(--p-surface-200);
  border-radius: var(--p-border-radius-sm);
  padding: 8px 10px;
}

.dialog-user-item-me {
  border-color: var(--p-primary-300);
  background-color: var(--p-primary-50);
}

.dialog-user-avatar {
  width: 22px;
  height: 22px;
  border-radius: 999px;
  background-color: var(--p-surface-300);
}

.dialog-user-name {
  font-size: 13px;
  color: var(--p-text-color);
}

.dialog-user-count {
  font-size: 12px;
  color: var(--p-text-muted-color);
}
</style>
