<script lang="ts" setup>
import {
  patchMyRemindStatus,
  type PatchMyRemindStatusBody,
} from '~/composables/type-fetch/anke-to/client';
import type { GatewayQuestionnaireSummary } from '~/models/questionnaire';
import {
  canRespond,
  checkIsDueOver,
  formatResponseDueDateTime,
} from '~/models/questionnaire';
import MarkdownBlock from '../markdown/markdown-block.vue';

defineProps<{
  questionnaires: GatewayQuestionnaireSummary[];
}>();

const toast = useToast();
const openRespondMenuQuestionnaireId = ref<number | null>(null);

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

const actionRespondLater = async (questionnaireId: number) => {
  const body: PatchMyRemindStatusBody = {
    is_remind_enabled: true,
  };

  try {
    await patchMyRemindStatus(questionnaireId, body);
    toast.add({
      summary: '後で回答するようリマインドを設定しました',
      severity: 'success',
      life: 3000,
    });
  } catch {
    toast.add({
      summary: '回答設定の更新に失敗しました',
      severity: 'error',
      life: 3000,
    });
  }
};

const isRespondMenuOpen = (questionnaireId: number) =>
  openRespondMenuQuestionnaireId.value === questionnaireId;

const toggleRespondMenu = (questionnaireId: number) => {
  openRespondMenuQuestionnaireId.value = isRespondMenuOpen(questionnaireId)
    ? null
    : questionnaireId;
};

const closeRespondMenu = () => {
  openRespondMenuQuestionnaireId.value = null;
};

const handleRespondLaterClick = async (questionnaireId: number) => {
  closeRespondMenu();
  await actionRespondLater(questionnaireId);
};

const handleClickOutsideRespondMenu = (event: MouseEvent) => {
  if (openRespondMenuQuestionnaireId.value === null) {
    return;
  }

  const target = event.target;
  if (!(target instanceof HTMLElement)) {
    return;
  }

  if (target.closest('.respond-split')) {
    return;
  }

  closeRespondMenu();
};

onMounted(() => {
  document.addEventListener('mousedown', handleClickOutsideRespondMenu);
});

onBeforeUnmount(() => {
  document.removeEventListener('mousedown', handleClickOutsideRespondMenu);
});
</script>

<template>
  <TransitionGroup name="card-sort" tag="ul" class="card-list">
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

            <div class="hover-menu">
              <button
                type="button"
                class="hover-menu-trigger"
                aria-label="その他の操作"
                title="その他の操作"
              >
                <Icon name="mdi:dots-vertical" size="20px" />
              </button>

              <div
                class="hover-menu-list"
                role="menu"
                aria-label="その他の操作"
              >
                <NuxtLink class="hover-menu-item link-disabled">
                  <Icon name="mdi:flag" size="18px" />
                  <span>回答しない</span>
                </NuxtLink>

                <NuxtLink
                  class="hover-menu-item"
                  :to="`/questionnaires/${questionnaire.questionnaire_id}/result`"
                >
                  <Icon name="mdi:forum-outline" size="18px" />
                  <span>結果を見る</span>
                </NuxtLink>

                <NuxtLink
                  class="hover-menu-item"
                  :to="`/questionnaires/${questionnaire.questionnaire_id}/responses/new`"
                >
                  <Icon name="mdi:square-edit-outline" size="18px" />
                  <span>アンケートを編集</span>
                </NuxtLink>
              </div>
            </div>
          </div>

          <div
            class="respond-split"
            :class="{
              'is-disabled': !canRespond(questionnaire),
              'is-menu-open': isRespondMenuOpen(questionnaire.questionnaire_id),
            }"
          >
            <button
              type="button"
              class="respond-main-button"
              title="回答する"
              :disabled="!canRespond(questionnaire)"
              @click="
                closeRespondMenu();
                navigateTo(
                  `/questionnaires/${questionnaire.questionnaire_id}/responses/new`,
                );
              "
            >
              <span class="respond-hover-label">回答する</span>
              <Icon class="send-icon-optical-fix" name="mdi:send" size="20px" />
            </button>

            <button
              type="button"
              class="respond-menu-trigger"
              aria-haspopup="menu"
              :aria-expanded="isRespondMenuOpen(questionnaire.questionnaire_id)"
              aria-label="回答アクションを開く"
              :disabled="!canRespond(questionnaire)"
              @click.stop="toggleRespondMenu(questionnaire.questionnaire_id)"
            >
              <Icon name="mdi:chevron-down" size="18px" />
            </button>

            <Transition name="respond-menu-transition">
              <div
                v-if="isRespondMenuOpen(questionnaire.questionnaire_id)"
                class="respond-menu"
                role="menu"
                aria-label="回答アクション"
              >
                <button
                  type="button"
                  class="respond-menu-item"
                  role="menuitem"
                  @click="
                    handleRespondLaterClick(questionnaire.questionnaire_id)
                  "
                >
                  <Icon name="mdi:send-clock" size="18px" />
                  <span>後で回答する</span>
                </button>
              </div>
            </Transition>
          </div>
        </div>
      </article>
    </li>
  </TransitionGroup>
</template>

<style lang="scss" scoped>
.card-list {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 12px;
  list-style-type: none;

  li {
    width: 100%;
  }
}

.card-sort {
  &-move {
    transition: transform 0.28s cubic-bezier(0.22, 1, 0.36, 1);
  }

  &-enter-active {
    transition:
      opacity 0.1s ease,
      transform 0.22s ease;
  }

  &-enter-from,
  &-leave-to {
    opacity: 0;
    transform: translateX(30px);
  }

  &-leave-active {
    position: absolute;
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
  gap: 16px;
  border: 1px solid var(--p-surface-300);
  border-radius: var(--p-border-radius-md);
  padding: 16px;
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
  --card-status-surface: color-mix(
    in srgb,
    variables.$color-primary 4%,
    var(--p-surface-0)
  );
}

.card.is-answered {
  --card-status-accent: var(--p-green-500);
  --card-status-surface: color-mix(in srgb, var(--p-green-100) 45%, white);
}

.card.is-draft {
  --card-status-accent: var(--p-blue-500);
  --card-status-surface: color-mix(in srgb, var(--p-blue-100) 50%, white);
}

.card.is-overdue {
  --card-status-accent: var(--p-orange-500);
  --card-status-surface: color-mix(in srgb, var(--p-orange-100) 50%, white);
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
  align-items: center;
  gap: 10px;
}

.status-badge {
  display: inline-flex;
  align-items: center;
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
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
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

.hover-menu {
  position: relative;
}

.hover-menu-trigger {
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

.hover-menu-trigger:hover {
  background-color: var(--p-surface-200);
}

.hover-menu-list {
  position: absolute;
  right: 0;
  bottom: calc(100% + 8px);
  z-index: 100;
  display: flex;
  flex-direction: column;
  gap: 6px;
  min-width: 180px;
  padding: 8px;
  border: 1px solid var(--p-surface-300);
  border-radius: var(--p-border-radius-md);
  background-color: var(--p-surface-0);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  opacity: 0;
  visibility: hidden;
  transform: translateY(4px);
  transition:
    opacity 0.16s ease,
    transform 0.16s ease,
    visibility 0.16s ease;
}

.hover-menu:hover .hover-menu-list,
.hover-menu:focus-within .hover-menu-list {
  opacity: 1;
  visibility: visible;
  transform: translateY(0);
}

.hover-menu-item {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  border-radius: var(--p-border-radius-sm);
  padding: 8px 10px;
  color: var(--p-text-color);
  text-decoration: none;
  white-space: nowrap;
}

.hover-menu-item:hover {
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

.respond-split {
  position: relative;
  display: inline-flex;
  align-items: stretch;
  border-radius: var(--p-border-radius-md);
}

.respond-main-button,
.respond-menu-trigger {
  border: none;
  background-color: variables.$color-primary;
  color: white;
  cursor: pointer;
  transition: filter 0.16s ease;
}

.respond-main-button:hover,
.respond-menu-trigger:hover {
  filter: brightness(0.95);
}

.respond-main-button:disabled,
.respond-menu-trigger:disabled {
  opacity: 0.55;
  cursor: not-allowed;
}

.respond-main-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0;
  min-height: 40px;
  padding: 0 8px;
  border-top-left-radius: var(--p-border-radius-md);
  border-bottom-left-radius: var(--p-border-radius-md);
  font-weight: 700;

  &:not(:disabled) {
    &:hover,
    &:focus-visible,
    &:focus {
      .respond-hover-label {
        max-width: 8em;
        opacity: 1;
        transform: translateX(2px);
        margin-inline: 6px 10px;
      }
    }
  }
}

.respond-hover-label {
  max-width: 0;
  opacity: 0;
  overflow: hidden;
  white-space: nowrap;
  transform: translateX(12%);
  margin-right: 0;
  transition:
    max-width 0.24s ease,
    opacity 0.2s ease,
    transform 0.24s ease,
    margin-right 0.24s ease;
}

.respond-menu-trigger {
  width: 36px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-left: 1px solid rgba(255, 255, 255, 0.35);
  border-top-right-radius: var(--p-border-radius-md);
  border-bottom-right-radius: var(--p-border-radius-md);
}

.respond-menu {
  position: absolute;
  right: 0;
  bottom: calc(100% + 8px);
  z-index: 15;
  min-width: 190px;
  padding: 8px;
  border: 1px solid var(--p-surface-300);
  border-radius: var(--p-border-radius-md);
  background-color: var(--p-surface-0);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
}

.respond-menu-transition-enter-active,
.respond-menu-transition-leave-active {
  transition:
    opacity 0.16s ease,
    transform 0.16s ease;
}

.respond-menu-transition-enter-from,
.respond-menu-transition-leave-to {
  opacity: 0;
  transform: translateY(4px);
}

.respond-split.is-disabled .respond-menu {
  display: none;
}

.link-disabled {
  pointer-events: none;
  cursor: not-allowed;
  opacity: 0.5;
}

.respond-menu-item {
  width: 100%;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  border: none;
  border-radius: var(--p-border-radius-sm);
  padding: 8px 10px;
  background-color: transparent;
  color: var(--p-text-color);
  cursor: pointer;
}

.respond-menu-item:hover {
  background-color: var(--p-surface-200);
}

.send-icon-optical-fix {
  transform: translateX(10%);
}

@media screen and (max-width: 900px) {
  .card {
    flex-direction: column;
    align-items: stretch;
  }

  .card-side {
    flex-direction: row;
    align-items: flex-start;
    justify-content: space-between;
  }

  .card-side-top {
    justify-content: flex-start;
  }

  .hover-menu-list {
    right: -42px;
  }
}

@media screen and (max-width: 560px) {
  .card-side {
    align-items: stretch;
  }
}
</style>
