<script setup lang="ts">
import type { MenuItem } from 'primevue/menuitem';

const props = defineProps<{
  sortMenuLabel: string;
  sortMenuItems: MenuItem[];
  onlyActiveDue: boolean;
  isFilterExpanded: boolean;
  advancedFilterId: string;
  isSortMenuItemSelected: (item: MenuItem) => boolean;
}>();

const emit = defineEmits<{
  'update:onlyActiveDue': [value: boolean];
  toggleFilterExpanded: [];
}>();

const isSortMenuOpen = ref(false);
const sortMenuRootRef = ref<HTMLElement | null>(null);
const sortMenuTriggerRef = ref<HTMLButtonElement | null>(null);
const sortMenuItemRefs = ref<HTMLButtonElement[]>([]);
const focusedSortMenuItemIndex = ref(0);

const updateOnlyActiveDue = (value: boolean | undefined) => {
  emit('update:onlyActiveDue', value ?? false);
};

const toggleActiveId = useId();
const sortMenuId = useId();
let sortActionTimer: ReturnType<typeof setTimeout> | undefined;

const itemLabel = (item: MenuItem) => (typeof item.label === 'function' ? item.label() : (item.label ?? ''));

const flatSortMenuItems = computed(() => props.sortMenuItems.flatMap((group) => group.items ?? []));

const menuItemIndex = (groupIndex: number, itemIndex: number) =>
  props.sortMenuItems
    .slice(0, groupIndex)
    .reduce((total, group) => total + (group.items?.length ?? 0), itemIndex);

const setSortMenuItemRef = (element: unknown, index: number) => {
  if (element instanceof HTMLButtonElement) {
    sortMenuItemRefs.value[index] = element;
  }
};

const focusSortMenuItem = (index: number) => {
  const itemCount = flatSortMenuItems.value.length;
  if (itemCount === 0) return;

  focusedSortMenuItemIndex.value = (index + itemCount) % itemCount;
  sortMenuItemRefs.value[focusedSortMenuItemIndex.value]?.focus();
};

const openSortMenu = async (focus: 'selected' | 'first' | 'last' = 'selected') => {
  isSortMenuOpen.value = true;
  await nextTick();

  if (focus === 'last') {
    focusSortMenuItem(flatSortMenuItems.value.length - 1);
    return;
  }

  const selectedIndex =
    focus === 'selected'
      ? flatSortMenuItems.value.findIndex((item) => props.isSortMenuItemSelected(item))
      : -1;
  focusSortMenuItem(Math.max(0, selectedIndex));
};

const closeSortMenu = (restoreTriggerFocus = false) => {
  isSortMenuOpen.value = false;
  if (restoreTriggerFocus) {
    void nextTick(() => sortMenuTriggerRef.value?.focus());
  }
};

const toggleSortMenu = () => {
  if (isSortMenuOpen.value) {
    closeSortMenu();
    return;
  }
  void openSortMenu();
};

const handleSortMenuTriggerKeydown = (event: KeyboardEvent) => {
  if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') return;
  event.preventDefault();
  void openSortMenu(event.key === 'ArrowUp' ? 'last' : 'first');
};

const handleSortMenuKeydown = (event: KeyboardEvent) => {
  switch (event.key) {
    case 'ArrowDown':
      event.preventDefault();
      focusSortMenuItem(focusedSortMenuItemIndex.value + 1);
      break;
    case 'ArrowUp':
      event.preventDefault();
      focusSortMenuItem(focusedSortMenuItemIndex.value - 1);
      break;
    case 'Home':
      event.preventDefault();
      focusSortMenuItem(0);
      break;
    case 'End':
      event.preventDefault();
      focusSortMenuItem(flatSortMenuItems.value.length - 1);
      break;
    case 'Escape':
      event.preventDefault();
      event.stopPropagation();
      closeSortMenu(true);
      break;
  }
};

const handleSortMenuFocusOut = (event: FocusEvent) => {
  const nextTarget = event.relatedTarget;
  if (nextTarget instanceof Node && sortMenuRootRef.value?.contains(nextTarget)) return;

  closeSortMenu();
};

const selectSortMenuItem = (item: MenuItem, event: MouseEvent) => {
  const command = item.command;
  closeSortMenu(true);

  // Let Vue commit the closed menu before the route and list update start.
  // Capture the command now because the menu item proxy is replaced when the
  // computed sort options update.
  sortActionTimer = setTimeout(() => {
    command?.({ originalEvent: event, item });
    sortActionTimer = undefined;
  });
};

const closeSortMenuFromOutside = (event: PointerEvent) => {
  const target = event.target;
  if (target instanceof Node && !sortMenuRootRef.value?.contains(target)) {
    closeSortMenu();
  }
};

onMounted(() => document.addEventListener('pointerdown', closeSortMenuFromOutside));
onBeforeUnmount(() => {
  document.removeEventListener('pointerdown', closeSortMenuFromOutside);
  if (sortActionTimer !== undefined) {
    clearTimeout(sortActionTimer);
  }
});
</script>

<template>
  <div class="filter-row">
    <div ref="sortMenuRootRef" class="summary-control sort-menu" @focusout="handleSortMenuFocusOut">
      <button
        ref="sortMenuTriggerRef"
        type="button"
        class="sort-menu-trigger"
        aria-haspopup="menu"
        :aria-expanded="isSortMenuOpen"
        :aria-controls="sortMenuId"
        @click="toggleSortMenu"
        @keydown="handleSortMenuTriggerKeydown"
      >
        <span class="sort-menu-trigger-label">並べ方</span>
        <span class="sort-menu-trigger-current">{{ props.sortMenuLabel }}</span>
        <Icon name="mdi:chevron-down" size="16px" :class="['sort-menu-trigger-chevron', { open: isSortMenuOpen }]" />
      </button>

      <div
        :id="sortMenuId"
        class="sort-menu-overlay"
        :class="{ open: isSortMenuOpen }"
        role="menu"
        :aria-hidden="!isSortMenuOpen"
        :inert="!isSortMenuOpen"
        @keydown="handleSortMenuKeydown"
      >
        <div
          v-for="(group, groupIndex) in props.sortMenuItems"
          :key="itemLabel(group)"
          class="sort-menu-group"
          role="group"
          :aria-labelledby="`${sortMenuId}-group-${groupIndex}`"
        >
          <div :id="`${sortMenuId}-group-${groupIndex}`" class="sort-menu-group-label">{{ itemLabel(group) }}</div>
          <button
            v-for="(item, itemIndex) in group.items"
            :key="itemLabel(item)"
            :ref="(element) => setSortMenuItemRef(element, menuItemIndex(groupIndex, itemIndex))"
            type="button"
            role="menuitemradio"
            :aria-checked="props.isSortMenuItemSelected(item)"
            :tabindex="menuItemIndex(groupIndex, itemIndex) === focusedSortMenuItemIndex ? 0 : -1"
            class="sort-menu-item-link"
            :class="{ selected: props.isSortMenuItemSelected(item) }"
            @focus="focusedSortMenuItemIndex = menuItemIndex(groupIndex, itemIndex)"
            @click="selectSortMenuItem(item, $event)"
          >
            <Icon
              name="mdi:check"
              size="16px"
              class="sort-menu-item-check"
              :class="{ visible: props.isSortMenuItemSelected(item) }"
            />
            <Icon v-if="item.icon" :name="item.icon" size="22px" class="sort-menu-order-icon" />
            <span>{{ itemLabel(item) }}</span>
          </button>
        </div>
      </div>
    </div>

    <div class="quick-actions">
      <label class="due-toggle" :for="toggleActiveId">
        <span>期限内のみ</span>
        <input
          :id="toggleActiveId"
          type="checkbox"
          class="due-toggle-input"
          :checked="props.onlyActiveDue"
          @change="updateOnlyActiveDue(($event.target as HTMLInputElement).checked)"
        />
        <span class="due-toggle-track" aria-hidden="true"><span class="due-toggle-handle" /></span>
      </label>

      <button
        type="button"
      class="advanced-filter-toggle"
      :aria-controls="props.advancedFilterId"
      :aria-expanded="props.isFilterExpanded"
      :aria-label="props.isFilterExpanded ? '高度なフィルタを閉じる' : '高度なフィルタを開く'"
        :title="props.isFilterExpanded ? '高度なフィルタを閉じる' : '高度なフィルタを開く'"
        @click="emit('toggleFilterExpanded')"
      >
        <Icon :name="props.isFilterExpanded ? 'mdi:filter-minus-outline' : 'mdi:filter-plus-outline'" size="18px" />
      </button>
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

.sort-menu-overlay {
  position: absolute;
  z-index: 110;
  top: calc(100% + 6px);
  left: 0;
  min-width: 260px;
  padding: 6px 0;
  border: 1px solid var(--p-surface-200);
  border-radius: var(--p-border-radius-md);
  background: var(--p-surface-0);
  box-shadow: var(--p-overlay-popover-shadow);
  contain: layout paint;
  opacity: 0;
  pointer-events: none;
  will-change: opacity;
}

.sort-menu-overlay.open {
  opacity: 1;
  pointer-events: auto;
}

.sort-menu-group-label {
  padding: 10px 12px 6px;
  color: var(--p-text-secondary);
  font-size: 12px;
  font-weight: 700;
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
  border: 0;
  background: transparent;
  font: inherit;
  text-align: left;
  cursor: pointer;
}

.sort-menu-item-link:hover,
.sort-menu-item-link:focus-visible {
  background: var(--p-surface-100);
  outline: none;
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
  cursor: pointer;
}

.due-toggle-input {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip: rect(0 0 0 0);
}

.due-toggle-track {
  position: relative;
  width: 48px;
  height: 28px;
  border: 1px solid transparent;
  border-radius: 999px;
  background: var(--p-surface-300);
  transition: background-color 0.16s ease;
}

.due-toggle-handle {
  position: absolute;
  top: 3px;
  left: 3px;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: var(--p-surface-0);
  transition: transform 0.16s ease;
}

.due-toggle-input:checked + .due-toggle-track {
  background: var(--p-primary-color);
}

.due-toggle-input:checked + .due-toggle-track .due-toggle-handle {
  transform: translateX(20px);
}

.due-toggle-input:focus-visible + .due-toggle-track {
  outline: 3px solid color-mix(in srgb, var(--p-primary-500) 24%, white);
  outline-offset: 2px;
}

.advanced-filter-toggle {
  width: 40px;
  min-height: 40px;
  padding: 0;
  border: 1px solid var(--p-surface-300);
  border-radius: var(--p-border-radius-md);
  background: transparent;
  color: var(--p-text-color);
  cursor: pointer;
}

.advanced-filter-toggle:hover,
.advanced-filter-toggle:focus-visible {
  background: var(--p-surface-100);
  outline: none;
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
