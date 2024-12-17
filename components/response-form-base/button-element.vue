<script lang="ts" setup>

const props = defineProps<{
    isOutline: boolean
}>();
</script>

<template>
  <Button :outlined="props.isOutline" class="form-action-button">
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
