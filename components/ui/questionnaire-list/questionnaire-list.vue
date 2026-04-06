<script lang="ts" setup>
import type { MenuItem } from 'primevue/menuitem';
import type { GatewayQuestionnaireSummary } from '~/models/questionnaire';
import {
  canRespond,
  canViewResults,
  checkIsDueOver,
  formatResponseDueDateTime,
} from '~/models/questionnaire';
import ButtonLink from '../button-link.vue';
import MarkdownBlock from '../markdown/markdown-block.vue';

defineProps<{
  questionnaires: GatewayQuestionnaireSummary[];
}>();

const actionMenuRef = ref<{ toggle: (event: MouseEvent) => void } | null>(null);
const actionMenuItems = ref<MenuItem[]>([]);

const statusLabel = (questionnaire: GatewayQuestionnaireSummary) => {
  if (!questionnaire.is_published) return '下書き';
  if (questionnaire.has_my_response) return '回答済み';
  if (canRespond(questionnaire)) return '未回答';
  if (checkIsDueOver(questionnaire)) return '期限切れ';
  return '公開中';
};

const statusClass = (questionnaire: GatewayQuestionnaireSummary) => {
  if (!questionnaire.is_published) return 'is-draft';
  if (questionnaire.has_my_response) return 'is-answered';
  if (canRespond(questionnaire)) return 'is-unanswered';
  if (checkIsDueOver(questionnaire)) return 'is-overdue';
  return 'is-open';
};

const buildActionMenuItems = (
  questionnaire: GatewayQuestionnaireSummary,
): MenuItem[] => {
  return [
    {
      label: '結果を見る',
      icon: 'mdi:chart-box-outline',
      route: `/questionnaires/${questionnaire.questionnaire_id}/result`,
      disabled: !canViewResults(questionnaire),
    },
    {
      label: 'アンケートを編集',
      icon: 'mdi:pencil-outline',
      route: `/questionnaires/${questionnaire.questionnaire_id}/edit`,
      disabled: !questionnaire.is_administrated_by_me,
    },
  ];
};

const toggleActionMenu = (
  event: MouseEvent,
  questionnaire: GatewayQuestionnaireSummary,
) => {
  actionMenuItems.value = buildActionMenuItems(questionnaire);
  actionMenuRef.value?.toggle(event);
};
</script>

<template>
  <div class="questionnaire-list-root">
    <ul class="card-list">
      <li
        v-for="questionnaire in questionnaires"
        :key="questionnaire.questionnaire_id"
      >
        <article class="card" :class="statusClass(questionnaire)">
          <div class="card-main">
            <div class="card-title-row">
              <span class="status-badge" :class="statusClass(questionnaire)">
                {{ statusLabel(questionnaire) }}
              </span>

              <NuxtLink
                class="card-title"
                :to="`/questionnaires/${questionnaire.questionnaire_id}`"
              >
                {{ questionnaire.title }}
              </NuxtLink>
            </div>

            <MarkdownBlock
              class="card-description"
              :content="questionnaire.description"
            />
          </div>

          <div class="card-side">
            <div class="card-side-top">
              <div class="due-chip">
                <Icon name="mdi:alarm" size="18px" />
                <span>{{ formatResponseDueDateTime(questionnaire) }}</span>
              </div>

              <div class="card-action-menu">
                <button
                  type="button"
                  class="card-action-menu-trigger"
                  aria-label="その他の操作"
                  title="その他の操作"
                  @click="toggleActionMenu($event, questionnaire)"
                >
                  <Icon name="mdi:dots-vertical" size="20px" />
                </button>
              </div>
            </div>

            <ButtonLink
              class="respond-main-button"
              variant="primary"
              :to="`/questionnaires/${questionnaire.questionnaire_id}/responses/new`"
              :disabled="!canRespond(questionnaire)"
              title="回答する"
            >
              <span class="respond-label">回答する</span>
              <Icon class="send-icon-optical-fix" name="mdi:send" size="20px" />
            </ButtonLink>
          </div>
        </article>
      </li>
    </ul>

    <Menu ref="actionMenuRef" :model="actionMenuItems" popup>
      <template #item="{ item, props: itemProps }">
        <NuxtLink
          v-if="item.route && !item.disabled"
          :to="item.route"
          class="action-menu-item-link"
          v-bind="itemProps.action"
        >
          <Icon v-if="item.icon" :name="item.icon" size="18px" />
          <span>{{ item.label }}</span>
        </NuxtLink>
        <span
          v-else
          class="action-menu-item-link is-disabled"
          aria-disabled="true"
        >
          <Icon v-if="item.icon" :name="item.icon" size="18px" />
          <span>{{ item.label }}</span>
        </span>
      </template>
    </Menu>
  </div>
</template>

<style lang="scss" scoped>
.questionnaire-list-root {
  position: relative;
}

.card-list {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 10px;
  list-style-type: none;

  li {
    width: 100%;
  }
}

.card {
  --card-status-accent: var(--p-surface-300);
  --card-status-surface: var(--p-surface-0);

  width: 100%;
  box-sizing: border-box;
  position: relative;
  display: flex;
  justify-content: space-between;
  gap: 14px;
  border: 1px solid var(--p-surface-300);
  border-radius: var(--p-border-radius-md);
  padding: 14px;
  background-color: var(--card-status-surface);
  overflow: visible;
}

.card::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 6px;
  background-color: var(--card-status-accent);
  border-radius: var(--p-border-radius-md) 0 0 var(--p-border-radius-md);
}

.card.is-unanswered {
  --card-status-accent: variables.$color-primary;
}

.card.is-answered {
  --card-status-accent: var(--p-green-500);
}

.card.is-draft {
  --card-status-accent: var(--p-blue-500);
}

.card.is-overdue {
  --card-status-accent: var(--p-orange-500);
}

.card.is-open {
  --card-status-accent: var(--p-surface-400);
}

@media (prefers-contrast: more) {
  .card {
    --card-status-surface: var(--p-surface-0);
  }
}

.card-main {
  min-width: 0;
  flex: 1;
}

.card-title-row {
  display: flex;
  align-items: flex-start;
  gap: 10px;
}

.status-badge {
  display: inline-flex;
  align-items: center;
  flex-shrink: 0;
  border-radius: 999px;
  padding: 4px 10px;
  font-size: 12px;
  font-weight: 700;
  white-space: nowrap;
}

.status-badge.is-unanswered {
  background-color: color-mix(in srgb, variables.$color-primary 18%, white);
  color: variables.$color-primary;
}

.status-badge.is-answered {
  background-color: var(--p-green-100);
  color: var(--p-green-900);
}

.status-badge.is-draft {
  background-color: var(--p-blue-100);
  color: var(--p-blue-900);
}

.status-badge.is-overdue {
  background-color: var(--p-orange-100);
  color: var(--p-orange-900);
}

.status-badge.is-open {
  background-color: var(--p-surface-200);
  color: var(--p-text-secondary);
}

.card-title {
  min-width: 0;
  color: inherit;
  text-decoration: none;
  font-size: 18px;
  font-weight: 700;
  line-height: 1.35;
  overflow: hidden;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  line-clamp: 2;
}

.card-title:hover {
  text-decoration: underline;
}

.card-description {
  position: relative;
  overflow: hidden;
  max-height: 4rem;
}

.card-description::after {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  top: 2.5rem;
  height: 1.5rem;
  background: linear-gradient(
    to bottom,
    rgba(255, 255, 255, 0),
    var(--card-status-surface)
  );
  pointer-events: none;
}

.card-side {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-end;
  gap: 12px;
}

.card-side-top {
  display: inline-flex;
  align-items: center;
  justify-content: flex-end;
  gap: 8px;
}

.card-action-menu-trigger {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border: none;
  border-radius: var(--p-border-radius-md);
  color: var(--p-text-color);
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.card-action-menu-trigger:hover {
  background-color: var(--p-surface-200);
}

.due-chip {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 14px;
  color: var(--p-text-secondary);
  white-space: nowrap;
}

.respond-main-button {
  min-height: 40px;
}

.respond-main-button :deep(.button-link-anchor) {
  gap: 8px;
  padding-inline: 12px;
}

.respond-label {
  white-space: nowrap;
}

.send-icon-optical-fix {
  transform: translateX(10%);
}

.action-menu-item-link {
  width: 100%;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  text-decoration: none;
  color: var(--p-text-color);
  padding: 8px 16px;
}

.action-menu-item-link.is-disabled {
  opacity: 0.55;
  color: var(--p-text-secondary);
  cursor: not-allowed;
}

@media screen and (max-width: 900px) {
  .card {
    flex-direction: column;
    align-items: stretch;
    gap: 12px;
  }

  .card-side {
    flex-direction: row;
    align-items: flex-start;
    justify-content: space-between;
  }

  .card-side-top {
    justify-content: flex-start;
  }

  .card-title-row {
    padding-right: 40px;
  }

  .card-action-menu {
    position: absolute;
    top: 16px;
    right: 16px;
  }
}

@media screen and (max-width: 560px) {
  .card-list {
    gap: 8px;
  }

  .card {
    padding: 12px;
    gap: 10px;
  }

  .card-title-row {
    gap: 8px;
    padding-right: 36px;
  }

  .card-title {
    font-size: 16px;
  }

  .due-chip {
    font-size: 13px;
  }

  .card-side {
    align-items: stretch;
  }

  .respond-main-button {
    width: 100%;
  }

  .card-action-menu {
    top: 12px;
    right: 12px;
  }
}
</style>
