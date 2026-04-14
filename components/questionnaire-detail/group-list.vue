<script lang="ts" setup>
import { useMe } from '~/composables/type-fetch/anke-to/client';
import GroupChip from '~/components/ui/group-chip.vue';

const props = defineProps<{
  groups: { name: string; members: string[] }[];
  dialogTitle?: string;
}>();

const MAX_VISIBLE_GROUPS = 10;

const { data: me } = useMe();
const isDialogVisible = ref(false);

const sortedGroups = computed(() => {
  return [...props.groups].sort((a, b) => {
    const aMe = a.members.includes(me.value?.name || '');
    const bMe = b.members.includes(me.value?.name || '');
    if (aMe && !bMe) return -1;
    if (!aMe && bMe) return 1;
    return 0;
  });
});

const visibleGroups = computed(() =>
  sortedGroups.value.slice(0, MAX_VISIBLE_GROUPS),
);
const hiddenGroupCount = computed(
  () => sortedGroups.value.length - visibleGroups.value.length,
);
</script>

<template>
  <div class="group-list-wrapper">
    <div class="group-chip-list">
      <GroupChip
        v-for="group in visibleGroups"
        :key="group.name"
        :name="group.name"
        :highlighted="group.members.includes(me?.name || '')"
      />

      <button
        v-if="hiddenGroupCount > 0"
        type="button"
        class="group-chip-more"
        @click="isDialogVisible = true"
      >
        +{{ hiddenGroupCount }}
      </button>
    </div>

    <Dialog
      v-model:visible="isDialogVisible"
      modal
      dismissable-mask
      :header="props.dialogTitle ?? 'グループ一覧'"
      :style="{ width: 'min(640px, 92vw)' }"
    >
      <div class="dialog-group-list">
        <div
          v-for="group in sortedGroups"
          :key="`dialog-${group.name}`"
          class="dialog-group-item"
          :class="{
            'dialog-group-item-me': group.members.includes(me?.name || ''),
          }"
        >
          <Icon name="mdi:account-group" size="16px" class="group-chip-icon" />
          <span>@{{ group.name }}</span>
        </div>
      </div>
    </Dialog>
  </div>
</template>

<style lang="scss" scoped>
.group-list-wrapper {
  width: 100%;
}

.group-chip-list {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  width: 100%;
}

.group-chip-more {
  border: 1px dashed var(--p-surface-400);
  border-radius: 999px;
  background-color: var(--p-surface-0);
  color: var(--p-text-secondary);
  padding: 3px 10px;
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;
}

.group-chip-more:hover {
  background-color: var(--p-surface-100);
}

.dialog-group-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 8px;
  max-height: min(65vh, 520px);
  overflow-y: auto;
}

.dialog-group-item {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  border: 1px solid var(--p-surface-200);
  border-radius: var(--p-border-radius-sm);
  padding: 8px 10px;
  color: var(--p-text-color);
}

.dialog-group-item-me {
  border-color: var(--p-primary-300);
  background-color: var(--p-primary-50);
}
</style>
