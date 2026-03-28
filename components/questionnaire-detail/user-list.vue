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
  return Array.from(counts.entries());
});
</script>

<template>
  <div v-if="props.users.length === 0" class="empty-message">いません</div>
  <div v-else class="user-list">
    <span
      v-for="([user, count], i) in userCounts"
      :key="user"
      class="user-element"
    >
      <span :class="{ highlighted: me?.name === user }">
        {{ '@' + user }}
      </span>
      <template v-if="count > 1">{{ ' ' }}({{ count }})</template>
      {{ ' ' }}
    </span>
  </div>
</template>

<style lang="scss" scoped>
.empty-message {
  color: var(--p-surface-500);
  font-style: italic;
}

.user-list {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}

.highlighted {
  background-color: #eee260;
  font-weight: bold;
}
</style>
