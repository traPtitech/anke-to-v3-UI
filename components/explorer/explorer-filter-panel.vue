<script lang="ts" setup>
import type { ExplorerFilterPayload, TabKey } from './filter-types';
import { useExplorerFilterPanel } from './use-explorer-filter-panel';

const props = withDefaults(
  defineProps<{
    tabCounts?: Partial<Record<TabKey, number>>;
  }>(),
  {
    tabCounts: () => ({}),
  },
);

const emit = defineEmits<{
  change: [payload: ExplorerFilterPayload];
}>();

const {
  tabs,
  isFilterExpanded,
  isSortMenuOpen,
  sortMenuRef,
  sortMenuItems,
  sortMenuLabel,
  onlyActiveDue,
  filterTargetingMe,
  filterAdministratedByMe,
  filterHasMyResponse,
  filterUnansweredByMe,
  filterHasMyDraft,
  filterUnpublishedOnly,
  selectedTab,
  selectTab,
  tabCount,
  toggleSortMenu,
  isSortMenuItemSelected,
} = useExplorerFilterPanel({
  tabCounts: toRef(props, 'tabCounts'),
  onChange: (payload) => {
    emit('change', payload);
  },
});
</script>

<template>
  <div class="explorer-filter-panel">
    <div class="tab-row">
      <button
        v-for="tab in tabs"
        :key="tab.key"
        type="button"
        class="tab-button"
        :class="{ active: selectedTab === tab.key }"
        @click="selectTab(tab.key)"
      >
        {{ tab.label }}
        <span class="tab-count">({{ tabCount(tab.key) }})</span>
      </button>
    </div>

    <section class="filter-shell">
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
            <span class="sort-menu-trigger-current">{{ sortMenuLabel }}</span>
            <Icon
              name="mdi:chevron-down"
              size="16px"
              :class="['sort-menu-trigger-chevron', { open: isSortMenuOpen }]"
            />
          </button>

          <Menu
            ref="sortMenuRef"
            :model="sortMenuItems"
            popup
            class="sort-menu-overlay"
            @show="isSortMenuOpen = true"
            @hide="isSortMenuOpen = false"
          >
            <template #item="{ item, props: itemProps }">
              <a
                v-bind="itemProps.action"
                class="sort-menu-item-link"
                :class="{ selected: isSortMenuItemSelected(item) }"
              >
                <Icon
                  name="mdi:check"
                  size="16px"
                  class="sort-menu-item-check"
                  :class="{ visible: isSortMenuItemSelected(item) }"
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

        <div class="due-toggle">
          <label for="toggle-active-due">期限内のみ</label>
          <ToggleSwitch id="toggle-active-due" v-model="onlyActiveDue" />
        </div>

        <Button
          class="advanced-filter-toggle"
          severity="secondary"
          outlined
          :aria-label="
            isFilterExpanded ? '高度なフィルタを閉じる' : '高度なフィルタを開く'
          "
          :title="
            isFilterExpanded ? '高度なフィルタを閉じる' : '高度なフィルタを開く'
          "
          @click="isFilterExpanded = !isFilterExpanded"
        >
          <Icon
            :name="
              isFilterExpanded
                ? 'mdi:filter-minus-outline'
                : 'mdi:filter-plus-outline'
            "
            size="18px"
          />
        </Button>
      </div>

      <Accordion
        :value="isFilterExpanded ? 'advanced' : undefined"
        class="advanced-filter-accordion"
      >
        <AccordionPanel value="advanced">
          <AccordionHeader class="advanced-filter-hidden-header">
            高度なフィルタ
          </AccordionHeader>
          <AccordionContent>
            <div class="advanced-filter-panel">
              <div class="advanced-filter-grid">
                <div class="advanced-filter-block">
                  <div class="advanced-filter-title">回答</div>
                  <label class="advanced-switch-item" for="advanced-targeting">
                    <Checkbox
                      v-model="filterTargetingMe"
                      input-id="advanced-targeting"
                      binary
                    />
                    <span>自分が対象</span>
                  </label>
                  <label class="advanced-switch-item" for="advanced-answered">
                    <Checkbox
                      v-model="filterHasMyResponse"
                      input-id="advanced-answered"
                      binary
                    />
                    <span>自分が回答済み</span>
                  </label>
                  <label class="advanced-switch-item" for="advanced-unanswered">
                    <Checkbox
                      v-model="filterUnansweredByMe"
                      input-id="advanced-unanswered"
                      binary
                    />
                    <span>自分が未回答</span>
                  </label>
                  <label class="advanced-switch-item" for="advanced-draft">
                    <Checkbox
                      v-model="filterHasMyDraft"
                      input-id="advanced-draft"
                      binary
                    />
                    <span>自分の下書きあり</span>
                  </label>
                </div>

                <div class="advanced-filter-block">
                  <div class="advanced-filter-title">管理</div>
                  <label class="advanced-switch-item" for="advanced-admin">
                    <Checkbox
                      v-model="filterAdministratedByMe"
                      input-id="advanced-admin"
                      binary
                    />
                    <span>自分が管理中</span>
                  </label>
                  <label
                    class="advanced-switch-item"
                    for="advanced-unpublished"
                  >
                    <Checkbox
                      v-model="filterUnpublishedOnly"
                      input-id="advanced-unpublished"
                      binary
                    />
                    <span>未公開 (下書き)</span>
                  </label>
                </div>
              </div>
            </div>
          </AccordionContent>
        </AccordionPanel>
      </Accordion>
    </section>
  </div>
</template>

<style scoped lang="scss">
.explorer-filter-panel {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.tab-row {
  display: flex;
  flex-wrap: nowrap;
  align-items: center;
  gap: 8px;
  overflow-x: auto;
  border-bottom: 1px solid var(--p-surface-300);
  padding: 10px 0;
  background-color: var(--p-surface-0);
}

.tab-button {
  flex: 0 0 auto;
  border: none;
  border-radius: 999px;
  background-color: var(--p-surface-100);
  color: var(--p-text-color);
  font-weight: 700;
  line-height: 1;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 10px 14px;
}

.tab-button.active {
  background-color: color-mix(in srgb, variables.$color-primary 15%, white);
  color: variables.$color-primary;
}

.tab-count {
  color: var(--p-text-secondary);
}

.filter-shell {
  border: 1px solid var(--p-surface-300);
  border-radius: var(--p-border-radius-md);
  background-color: var(--p-surface-0);
  overflow: hidden;
}

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
  transition: transform 0.18s ease;
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

.due-toggle {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
}

.advanced-filter-toggle {
  margin-left: auto;
  width: 40px;
  min-height: 40px;
  padding: 0;
}

.advanced-filter-panel {
  border-top: 1px solid var(--p-surface-300);
  padding: 14px 12px 12px;
  background-color: var(--p-surface-0);
}

.advanced-filter-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
}

.advanced-filter-block {
  border: 1px solid var(--p-surface-300);
  border-radius: var(--p-border-radius-md);
  padding: 10px;
  background-color: var(--p-surface-0);
}

.advanced-filter-title {
  margin-bottom: 8px;
  font-size: 13px;
  font-weight: 700;
  color: var(--p-text-secondary);
}

.advanced-switch-item {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  cursor: pointer;
}

.advanced-switch-item + .advanced-switch-item {
  margin-top: 8px;
}

:deep(.advanced-filter-accordion .p-accordionpanel),
:deep(.advanced-filter-accordion .p-accordioncontent) {
  border: none;
}

:deep(.advanced-filter-accordion .p-accordionheader) {
  display: none;
}

:deep(.advanced-filter-accordion .p-accordioncontent-content) {
  padding: 0;
}

.advanced-filter-hidden-header {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

@media screen and (max-width: 900px) {
  .advanced-filter-grid {
    grid-template-columns: 1fr;
  }
}

@media screen and (max-width: 560px) {
  .summary-control {
    min-width: 0;
    width: 100%;
  }

  .sort-menu-trigger {
    width: 100%;
    justify-content: space-between;
  }

  .due-toggle {
    width: 100%;
    justify-content: flex-start;
  }

  .advanced-filter-toggle {
    margin-left: 0;
  }
}
</style>
