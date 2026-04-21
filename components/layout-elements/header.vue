<script lang="ts" setup>
import ButtonLink from '~/components/ui/button-link.vue';
import { buildTabFilterQuery } from '~/components/explorer/filter-query';
import { explorerQueryKeys } from '~/composables/explorer/query-params';
import { useMe } from '~/composables/type-fetch/anke-to/client';

const searchText = defineModel<string>('search', { default: '' });

const { data: me } = useMe();

const userIconSrc = computed(() => {
  const name = me.value?.name;
  if (!name) return undefined;
  return getUserAvatarUrl(name);
});

const answeredFilterQuery = buildTabFilterQuery('answered');
</script>

<template>
  <header class="header hide-search-on-mobile">
    <NuxtLink to="/explorer" class="logo-link" aria-label="anke-to home">
      <img src="~/assets/img/logo.svg" alt="anke-to" class="logo-image" />
    </NuxtLink>

    <div class="header-center">
      <div class="search-field search-field-with-icon">
        <Icon class="search-icon" name="mdi:magnify" size="24px" />
        <InputText
          v-model="searchText"
          placeholder="タイトルで検索"
          aria-label="アンケートのタイトルで検索"
          class="search-input"
        />
      </div>
    </div>

    <div class="top-actions">
      <ButtonLink
        to="/questionnaires/new"
        variant="primary"
        class="header-create-button"
        aria-label="新規作成"
      >
        <Icon name="mdi:plus" size="20px" class="header-create-button-icon" />
        <span>新規作成</span>
      </ButtonLink>
      <NuxtLink
        class="header-action-responses"
        :to="{
          path: '/explorer',
          query: {
            [explorerQueryKeys.filter]: answeredFilterQuery,
          },
        }"
        title="自分の回答一覧へ"
        aria-label="自分の回答一覧へ"
      >
        <img
          v-if="userIconSrc"
          :src="userIconSrc"
          alt=""
          class="header-action-user-icon"
        />
        <Icon v-else name="mdi:account" size="40px" />
      </NuxtLink>
    </div>
  </header>
</template>

<style scoped lang="scss">
.header {
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 32px 12px;
  border-bottom: 1px solid var(--p-surface-300);
  background-color: var(--p-surface-0);
}

.logo-link {
  display: inline-flex;
  align-items: center;
}

.logo-image {
  width: 156px;
  height: auto;
}

.header-center {
  flex: 1;
  min-width: 0;
  display: flex;
  justify-content: center;
}

.top-actions {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 10px;
}

.search-field {
  max-width: 65%;
  flex: 1;
}

.search-field-with-icon {
  position: relative;
}

.search-icon {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--p-text-secondary);
  pointer-events: none;
  z-index: 1;
}

.search-input {
  width: 100%;
  padding-left: 42px;
}

:deep(.header-create-button) {
  height: 40px;
}

.header-create-button-icon {
  transform: translateX(-2px);
}

.label-mobile {
  display: none;
}

.header-action-responses {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  min-height: 40px;
  padding: 0;
  overflow: hidden;
  border-radius: 999px;
  color: var(--p-text-color);
}

.header-action-user-icon {
  width: 100%;
  height: 100%;
  display: block;
  object-fit: cover;
}

@media screen and (max-width: 900px) {
  .header.hide-search-on-mobile .header-center {
    flex-direction: column;
    display: none;
  }

  .header-center {
    width: 100%;
  }

  .search-field {
    width: 100%;
  }

  .header {
    padding: 12px 16px;
  }

  .logo-image {
    width: 120px;
  }

  .top-actions {
    gap: 8px;
  }

  :deep(.header-create-button) {
    height: 32px;
    padding: 0 8px;
    font-size: 14px;
  }

  .header-create-button-icon {
    transform: translateX(0);
  }

  .header-action-responses {
    width: 36px;
    height: 36px;
    min-height: 36px;
  }
}

@media screen and (max-width: 480px) {
  .header {
    padding: 8px 12px;
  }

  .logo-image {
    width: 90px;
  }

  .top-actions {
    gap: 6px;
  }

  .header-action-responses {
    width: 32px;
    height: 32px;
    min-height: 32px;
  }
}
</style>
