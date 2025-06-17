<script lang="ts" setup>
import { paths } from './navigation-paths';

const route = useRoute();
const activeIndex = ref(0);

const noActive = computed(() =>
  paths.every((path) => path.href !== route.path),
);

watch(
  () => route.path,
  (currentPath, prevPath) => {
    const nextIndex = paths.findIndex((path) => path.href === currentPath);
    if (nextIndex !== -1) {
      activeIndex.value = nextIndex;
      return;
    }

    const prevIndex = paths.findIndex((path) => path.href === prevPath);
    if (prevIndex !== -1) {
      activeIndex.value = prevIndex;
    }
  },
  { immediate: true },
);
</script>

<template>
  <nav class="nav-container">
    <nuxt-link class="nav-header-desktop" href="/">
      <img src="~/assets/img/logo.svg" alt="anke-to" />
    </nuxt-link>

    <nuxt-link class="nav-header-tablet" href="/">
      <img src="~/assets/img/icon.svg" alt="anke-to" />
    </nuxt-link>

    <div class="nav-links" :class="{ 'no-active': noActive }">
      <nuxt-link
        v-for="(path, index) in paths"
        :key="path.href"
        class="nav-link"
        :href="path.href"
        :aria-current-value="activeIndex === index ? 'page' : undefined"
      >
        <Icon :name="path.icon" size="24px" />
        <span>{{ path.label }}</span>
      </nuxt-link>
    </div>
  </nav>
</template>

<style lang="scss" scoped>
$side-navigation-background-color: hsl(0, 100%, 98%);
$side-navigation-text-color: #333;
$side-navigation-accent-color: hsl(0, 70%, 90%);

.nav-container {
  display: flex;
  flex-direction: column;
  width: 240px;
  padding: 16px 0;
  height: 100%;
  font-size: medium;
  font-weight: bold;
  background-color: $side-navigation-background-color;
}

.nav-header-desktop {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 64px;
  padding: 0 32px;

  margin-bottom: 32px;
}

.nav-header-tablet {
  display: none;
  align-items: center;
  justify-content: center;
  height: 64px;
  padding: 0 32px;

  margin-bottom: 16px;
}

.nav-header > img {
  width: 100%;
  max-width: 160px;
}

.nav-links {
  position: relative;
  display: flex;
  flex-direction: column;
}

.nav-links::before {
  position: absolute;
  top: calc(0.5rem + 4rem * v-bind(activeIndex));
  left: 16px;
  z-index: 0;
  display: block;
  width: calc(100% - 32px);
  height: 3rem;
  content: '';
  background-color: $side-navigation-accent-color;
  border-radius: 0.5rem;
  transition: all 0.2s cubic-bezier(0.19, 1, 0.22, 1);
}

.nav-links.no-active::before {
  opacity: 0;
  transition: opacity 0.2s cubic-bezier(0.19, 1, 0.22, 1);
}

.nav-link {
  z-index: 1;
  display: inline-flex;
  gap: 8px;
  align-items: center;
  height: 4rem;
  padding: 0 32px;
  text-decoration: none;
  transition: opacity 0.2s cubic-bezier(0.19, 1, 0.22, 1);
  color: $side-navigation-text-color;
  opacity: 0.7;
}

.nav-link:hover {
  opacity: 1;
}

.nav-link.router-link-exact-active {
  opacity: 1;
}

.nav-button {
  display: inline-flex;
  gap: 4px;
  align-items: center;
  padding: 32px;
  color: white;
  text-decoration: none;
}

@media screen and (max-width: variables.$breakpoint-md) {
  .nav-container {
    width: 100px;
  }

  .nav-header-desktop {
    display: none;
  }

  .nav-header-tablet {
    display: flex;
  }

  .nav-links::before {
    top: calc(0.5rem + 5rem * v-bind(activeIndex));
    left: 8px;
    width: calc(100% - 16px);
    height: 4rem;
    content: '';
  }

  .nav-link {
    flex-direction: column;
    gap: 4px;
    justify-content: center;
    height: 5rem;
    padding: 0;
    font-size: small;
  }
}
</style>
