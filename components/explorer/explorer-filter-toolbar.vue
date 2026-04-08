<script setup lang="ts">
import type { MenuItem } from 'primevue/menuitem';

const props = defineProps<{
  sortMenuLabel: string;
  sortMenuItems: MenuItem[];
  onlyActiveDue: boolean;
  isFilterExpanded: boolean;
  isSortMenuItemSelected: (item: MenuItem) => boolean;
}>();

const emit = defineEmits<{
  'update:onlyActiveDue': [value: boolean];
  toggleFilterExpanded: [];
}>();

const isSortMenuOpen = ref(false);
const sortMenuRef = ref<{ toggle: (event: MouseEvent) => void } | null>(null);

const toggleSortMenu = (event: MouseEvent) => {
  sortMenuRef.value?.toggle(event);
};

const updateOnlyActiveDue = (value: boolean | undefined) => {
  emit('update:onlyActiveDue', value ?? false);
};

const toggleActiveId = useId();
</script>

<template>
  <div class="filter-row">
    <div class="summary-control sort-menu">
      <button
        type="button"
        class="sort-menu-trigger"
        aria-haspopup="menu"
        :aria-expanded="isSortMenuOpen"
        @click="toggleSortMenu"
      >
        <span class="sort-menu-trigger-label">並べ方</span>
        <span class="sort-menu-trigger-current">{{ props.sortMenuLabel }}</span>
        <Icon
          name="mdi:chevron-down"
          size="16px"
          :class="['sort-menu-trigger-chevron', { open: isSortMenuOpen }]"
        />
      </button>

      <Menu
        ref="sortMenuRef"
        :model="props.sortMenuItems"
        popup
        class="sort-menu-overlay"
        @show="isSortMenuOpen = true"
        @hide="isSortMenuOpen = false"
      >
        <template #item="{ item, props: itemProps }">
          <a
            v-bind="itemProps.action"
            class="sort-menu-item-link"
            :class="{ selected: props.isSortMenuItemSelected(item) }"
          >
            <Icon
              name="mdi:check"
              size="16px"
              class="sort-menu-item-check"
              :class="{ visible: props.isSortMenuItemSelected(item) }"
            />
            <Icon
              v-if="item.icon"
              :name="item.icon"
              size="22px"
              class="sort-menu-order-icon"
            />
            <span>{{ item.label }}</span>
          </a>
        </template>
      </Menu>
    </div>

    <div class="quick-actions">
      <div class="due-toggle">
        <label :for="toggleActiveId">期限内のみ</label>
        <ToggleSwitch
          :input-id="toggleActiveId"
          :model-value="props.onlyActiveDue"
          @update:model-value="updateOnlyActiveDue"
        />
      </div>

      <Button
        class="advanced-filter-toggle"
        severity="secondary"
        outlined
        :aria-label="
          props.isFilterExpanded
            ? '高度なフィルタを閉じる'
            : '高度なフィルタを開く'
        "
        :title="
          props.isFilterExpanded
            ? '高度なフィルタを閉じる'
            : '高度なフィルタを開く'
        "
        @click="emit('toggleFilterExpanded')"
      >
        <Icon
          :name="
            props.isFilterExpanded
              ? 'mdi:filter-minus-outline'
              : 'mdi:filter-plus-outline'
          "
          size="18px"
        />
      </Button>
    </div>
  </div>
</template>

<style scoped lang="scss">
.filter-row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 12px;
  padding: 12px;
}

.summary-control {
  min-width: 220px;
}

.sort-menu {
  position: relative;
}

.sort-menu-trigger {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  min-height: 40px;
  border: 1px solid var(--p-surface-300);
  border-radius: var(--p-border-radius-md);
  padding: 8px 12px;
  background-color: var(--p-surface-0);
  color: var(--p-text-color);
  cursor: pointer;
}

.sort-menu-trigger-label {
  color: var(--p-text-secondary);
  font-size: 13px;
}

.sort-menu-trigger-current {
  font-size: 14px;
  font-weight: 600;
}

.sort-menu-trigger-chevron {
  transition: transform 0.16s ease;
}

.sort-menu-trigger-chevron.open {
  transform: rotate(180deg);
}

.sort-menu-item-link {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--p-text-color);
  text-decoration: none;
  padding: 8px 12px;
}

.sort-menu-item-link.selected {
  font-weight: 600;
}

.sort-menu-item-check {
  opacity: 0;
}

.sort-menu-item-check.visible {
  opacity: 1;
}

.sort-menu-order-icon {
  color: var(--p-text-secondary);
}

.sort-menu-item-link.selected .sort-menu-order-icon {
  color: var(--p-text-color);
}

:deep(.sort-menu-overlay.p-menu) {
  min-width: 260px;
}

:deep(.sort-menu-overlay .p-menu-submenu-label) {
  font-size: 12px;
  color: var(--p-text-secondary);
  font-weight: 700;
  padding: 10px 12px 6px;
}

:deep(.sort-menu-overlay .p-menu-item-link) {
  padding: 0;
}

.quick-actions {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  margin-left: auto;
}

.due-toggle {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
}

.advanced-filter-toggle {
  width: 40px;
  min-height: 40px;
  padding: 0;
}

@media screen and (max-width: 560px) {
  .filter-row {
    gap: 10px;
    padding: 10px;
  }

  .summary-control {
    min-width: 0;
    width: 100%;
  }

  .sort-menu-trigger {
    width: 100%;
    justify-content: space-between;
  }

  .quick-actions {
    width: 100%;
    justify-content: space-between;
    margin-left: 0;
  }

  .due-toggle {
    flex: 1;
  }
}
</style>
