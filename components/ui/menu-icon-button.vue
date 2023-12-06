<script lang="ts" setup>
const { open } = defineProps<{ open: boolean }>();
</script>

<template>
  <button
    class="menu-icon-button"
    :class="{ open }"
    :aria-label="open ? 'メニューを閉じる' : 'メニューを開く'"
  >
    <span></span>
    <span></span>
    <span></span>
    <span></span>
  </button>
</template>

<style lang="scss" scoped>
.menu-icon-button {
  width: 24px;
  height: 16px;
  position: relative;
  transform: rotate(0deg);
  transition: 0.5s ease-in-out;
  cursor: pointer;
}

.menu-icon-button span {
  display: block;
  position: absolute;
  height: 1.6px;
  width: 100%;
  background: #333;
  border-radius: 2px;
  opacity: 1;
  left: 0;
  transform: rotate(0deg);
  transition: 0.2s cubic-bezier(0.19, 1, 0.22, 1);
}

.menu-icon-button span:nth-child(1) {
  top: 0px;
}

.menu-icon-button span:nth-child(2),
.menu-icon-button span:nth-child(3) {
  top: 7px;
}

.menu-icon-button span:nth-child(4) {
  top: 14px;
}

.menu-icon-button.open span:nth-child(1),
.menu-icon-button.open span:nth-child(4) {
  top: 7px;
  width: 0%;
  left: 50%;
}

.menu-icon-button.open span:nth-child(2) {
  transform: rotate(45deg);
}

.menu-icon-button.open span:nth-child(3) {
  transform: rotate(-45deg);
}
</style>
