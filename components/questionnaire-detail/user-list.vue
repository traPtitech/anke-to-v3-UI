<script lang="ts" setup>
import { useMe } from '~/composables/type-fetch/anke-to/client';

defineProps<{
  users: string[];
}>();

const { data: me } = useMe();
</script>

<template>
  <div v-if="users.length === 0" class="empty-message">いません</div>
  <div v-else class="user-list">
    <span v-for="user in users" :key="user" class="user-element">
      <span :class="{ highlighted: me?.name === user }">
        {{ '@' + user }}
      </span>
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
