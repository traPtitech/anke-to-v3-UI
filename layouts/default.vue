<template>
  <div class="container">
    <div class="side-navigation">
      <SideNavigation />
    </div>
    <div class="layout-header">
      <LayoutHeader />
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
  padding: 32px;
  overflow-y: auto;
}

.layout-header {
  display: none;
}

@media screen and (max-width: variables.$breakpoint-sm) {
  .container {
    flex-direction: column;
  }

  .side-navigation {
    display: none;
  }

  .layout-header {
    display: block;
  }

  main {
    padding: 16px;
  }
}
</style>
