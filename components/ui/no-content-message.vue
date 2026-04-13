<template>
  <div class="empty-message">
    <slot />
  </div>
</template>

<style lang="scss" scoped>
.empty-message {
  color: var(--p-text-muted-color);
  font-size: 13px;
}
</style>
