<script lang="ts" setup>
import { computed } from 'vue';
import { useMe } from '~/composables/type-fetch/anke-to/client';

const props = defineProps<{
  users: string[];
}>();

const { data: me } = useMe();

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
</script>

<template>
  <div v-if="props.users.length === 0" class="empty-message">いません</div>
  <div v-else class="user-chip-list">
    <span
      v-for="([user, count]) in userCounts"
      :key="user"
      class="user-chip"
      :class="{ 'user-chip-me': me?.name === user }"
    >
      <Icon name="mdi:account" size="14px" class="user-chip-icon" />
      <span class="user-chip-name">{{ '@' + user }}</span>
      <span v-if="count > 1" class="user-chip-count">({{ count }})</span>
    </span>
  </div>
</template>

<style lang="scss" scoped>
.empty-message {
  color: var(--p-text-muted-color);
  font-size: 13px;
  font-style: italic;
}

.user-chip-list {
  display: flex;
  flex-wrap: nowrap;
  gap: 6px;
  overflow-x: auto;
  padding-bottom: 4px;
  width: 100%;
  -webkit-overflow-scrolling: touch;

  // Custom scrollbar for a cleaner look
  &::-webkit-scrollbar {
    height: 4px;
  }
  &::-webkit-scrollbar-track {
    background: transparent;
  }
  &::-webkit-scrollbar-thumb {
    background: var(--p-surface-200);
    border-radius: 999px;
  }
  &:hover::-webkit-scrollbar-thumb {
    background: var(--p-surface-300);
  }
}

.user-chip {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 3px 10px 3px 6px;
  border-radius: 999px;
  font-size: 13px;
  font-weight: 500;
  background-color: var(--p-surface-100);
  color: var(--p-text-color);
  transition: all 0.15s ease;
  line-height: 1.4;
  white-space: nowrap;
  flex-shrink: 0;
}

.user-chip:hover {
  background-color: var(--p-surface-200);
}

.user-chip-icon {
  color: var(--p-text-muted-color);
}

.user-chip-me {
  background-color: var(--p-primary-50);
  color: var(--p-primary-700);
  font-weight: 600;
}

.user-chip-me .user-chip-icon {
  color: var(--p-primary-500);
}

.user-chip-me:hover {
  background-color: var(--p-primary-100);
}

.user-chip-count {
  font-size: 11px;
  color: var(--p-text-muted-color);
}
</style>
