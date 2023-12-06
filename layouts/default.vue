<template>
  <div class="container">
    <div class="side-navigation">
      <SideNavigation></SideNavigation>
    </div>
    <div class="layout-header">
      <LayoutHeader></LayoutHeader>
    </div>

    <main>
      <slot />
    </main>
  </div>
</template>

<style lang="scss" scoped>
.container {
  display: flex;
  flex-direction: row;
  height: 100vh;
}

main {
  flex: 1;
  padding: 16px;
}

.layout-header {
  display: none;
}

@media screen and (max-width: $breakpoint-sm) {
  .container {
    flex-direction: column;
  }

  .side-navigation {
    display: none;
  }

  .layout-header {
    display: block;
  }
}
</style>
