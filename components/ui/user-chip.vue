<script setup lang="ts">
import Chip from './chip.vue';

const props = withDefaults(
  defineProps<{
    username: string;
    count?: number;
    highlighted?: boolean;
    showAvatar?: boolean;
    prefixAt?: boolean;
  }>(),
  {
    count: 1,
    highlighted: false,
    showAvatar: true,
    prefixAt: true,
  },
);
</script>

<template>
  <Chip :highlighted="props.highlighted">
    <img
      v-if="props.showAvatar"
      class="user-chip-avatar"
      :src="getUserAvatarUrl(props.username)"
      aria-hidden="true"
    />
    <span class="user-chip-name">
      {{ props.prefixAt ? '@' + props.username : props.username }}
    </span>
    <span v-if="props.count > 1" class="user-chip-count">
      ({{ props.count }})
    </span>
  </Chip>
</template>

<style lang="scss" scoped>
.user-chip-avatar {
  width: 18px;
  height: 18px;
  border-radius: 999px;
  background-color: var(--p-surface-300);
}

.user-chip-name {
  color: inherit;
}

.user-chip-count {
  font-size: 11px;
  color: var(--p-text-muted-color);
}
</style>
