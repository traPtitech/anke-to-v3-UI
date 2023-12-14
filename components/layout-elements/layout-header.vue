<script lang="ts" setup>
import { paths } from './navigation-paths';

const menuOpen = ref(false);

const route = useRoute();
</script>

<template>
  <header>
    <div class="container">
      <div class="navigation-menu-background" />

      <MenuIconButton
        :open="menuOpen"
        class="menu-button"
        @click="menuOpen = !menuOpen"
      />

      <nuxt-link class="header-logo" href="/">
        <img src="~/assets/img/logo.svg" alt="anke-to" />
      </nuxt-link>

      <div class="navigation-menu-container" :class="{ open: menuOpen }">
        <div class="navigation-menu">
          <nuxt-link
            v-for="path in paths"
            :key="path.href"
            :to="path.href"
            class="navigation-menu-link"
            :aria-current-value="path.href === route.path ? 'page' : undefined"
            :class="{
              active: path.href === route.path,
            }"
          >
            <Icon :name="path.icon" size="24px" />
            <span>{{ path.label }}</span>
          </nuxt-link>
        </div>
      </div>
    </div>
  </header>
</template>

<style lang="scss" scoped>
$layout-header-background-color: hsl(0, 100%, 98%);
$side-navigation-accent-color: hsl(0, 70%, 90%);

.container {
  position: relative;
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 8px 16px;
  height: 48px;

  border-bottom: solid 1px #e0e0e0;
}

.navigation-menu-background {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  background-color: #fff;
  opacity: 0.8;
  z-index: -1;
}

.header-logo {
  width: 96px;
  margin-left: 16px;
}

.navigation-menu-container {
  z-index: 10;
  display: grid;
  grid-template-rows: 0fr;
  transition: grid-template-rows 0.2s cubic-bezier(0.19, 1, 0.22, 1);
  position: absolute;
  top: 48px;
  left: 0;
  width: 100%;
}

.navigation-menu-container.open {
  grid-template-rows: 1fr;
}

.navigation-menu {
  overflow-y: hidden;
  display: flex;
  flex-direction: column;
  background-color: $layout-header-background-color;
}

.navigation-menu-link {
  display: inline-flex;
  padding: 8px 16px;
  color: inherit;
  text-decoration: none;
  font-weight: bold;
  gap: 8px;
  border-bottom: solid 1px rgba(0, 0, 0, 0.1);
  transition: background-color 0.1s cubic-bezier(0.19, 1, 0.22, 1);
}

.navigation-menu-link.active {
  background-color: $side-navigation-accent-color;
}
</style>
