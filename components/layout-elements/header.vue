<script lang="ts" setup>
import { useMe } from '~/composables/type-fetch/anke-to/client';

const searchText = defineModel<string>('search', { default: '' });
const props = withDefaults(
  defineProps<{
    hideSearchOnMobile?: boolean;
  }>(),
  {
    hideSearchOnMobile: false,
  },
);
const { data: me } = useMe();

const goToCreate = () => navigateTo('/questionnaires/new');
const goToResponses = () =>
  navigateTo({
    path: '/explorer',
    hash: '#answered',
  });

const userIconSrc = computed(() => {
  const name = me.value?.name;
  if (!name) return undefined;
  return `https://q.trap.jp/api/v3/public/icon/${name}`;
});
</script>

<template>
  <header
    class="header"
    :class="{ 'hide-search-on-mobile': props.hideSearchOnMobile }"
  >
    <NuxtLink to="/" class="logo-link" aria-label="anke-to home">
      <img src="~/assets/img/logo.svg" alt="anke-to" class="logo-image" />
    </NuxtLink>

    <div class="header-center">
      <div class="search-field search-field-with-icon">
        <Icon class="search-icon" name="mdi:magnify" size="24px" />
        <InputText
          v-model="searchText"
          placeholder="タイトル・説明を検索"
          class="search-input"
        />
      </div>
    </div>

    <div class="top-actions">
      <Button class="header-action-create" @click="goToCreate">
        <Icon class="header-action-create-icon" name="mdi:plus" size="20px" />
        <span class="header-action-create-label">
          <span class="label-desktop">新規作成</span>
          <span class="label-mobile">新規</span>
        </span>
      </Button>
      <Button
        class="header-action-responses"
        severity="secondary"
        variant="outlined"
        aria-label="自分の回答一覧へ"
        @click="goToResponses"
      >
        <img
          v-if="userIconSrc"
          :src="userIconSrc"
          alt=""
          class="header-action-user-icon"
        />
        <Icon v-else name="mdi:account" size="18px" />
      </Button>
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

.header-action-create {
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.header-action-create-icon {
  display: block;
  transform: translateX(-15%);
}

.header-action-create-label {
  display: inline-flex;
  align-items: center;
  line-height: 1;
}

.label-mobile {
  display: none;
}

.header-action-responses {
  width: 40px;
  height: 40px;
  padding: 0;
  overflow: hidden;
  border-radius: 999px;
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
}

@media screen and (max-width: 480px) {
  .label-desktop {
    display: none;
  }

  .label-mobile {
    display: inline;
  }
}
</style>
