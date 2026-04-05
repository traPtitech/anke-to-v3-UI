<script lang="ts" setup>
import { useMe } from '~/composables/type-fetch/anke-to/client';

const props = defineProps<{
  groups: { name: string; members: string[] }[];
}>();

const { data: me } = useMe();

const sortedGroups = computed(() => {
  return [...props.groups].sort((a, b) => {
    const aMe = a.members.includes(me.value?.name || '');
    const bMe = b.members.includes(me.value?.name || '');
    if (aMe && !bMe) return -1;
    if (!aMe && bMe) return 1;
    return 0;
  });
});
</script>

<template>
  <div class="group-chip-list">
    <span
      v-for="group in sortedGroups"
      :key="group.name"
      class="group-chip"
      :class="{ 'group-chip-me': group.members.includes(me?.name || '') }"
    >
      <Icon name="mdi:account-group" size="14px" class="group-chip-icon" />
      <span class="group-chip-name">@{{ group.name }}</span>
    </span>
  </div>
</template>

<style lang="scss" scoped>
.group-chip-list {
  display: flex;
  flex-wrap: nowrap;
  gap: 6px;
  overflow-x: auto;
  padding-bottom: 4px;
  width: 100%;
  -webkit-overflow-scrolling: touch;

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

.group-chip {
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

.group-chip:hover {
  background-color: var(--p-surface-200);
}

.group-chip-icon {
  color: var(--p-text-muted-color);
}

.group-chip-me {
  background-color: var(--p-primary-50);
  color: var(--p-primary-700);
  font-weight: 600;
}

.group-chip-me .group-chip-icon {
  color: var(--p-primary-500);
}

.group-chip-me:hover {
  background-color: var(--p-primary-100);
}
</style>
