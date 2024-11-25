<script lang="ts" setup>
const emit = defineEmits<{ (e: 'clickButton'): void }>();

const handleClick = () => {
  emit('clickButton');
};
</script>

<template>
  <Button outlined class="form-action-button" @click="handleClick">
    <Icon name="mdi:content-save" size="24px" />
    <slot />
  </Button>
</template>

<style lang="scss" scoped>
.form-action-button {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-weight: bold;
}
</style>
