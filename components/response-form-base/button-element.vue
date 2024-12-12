<script lang="ts" setup>
const emit = defineEmits<{ (e: 'clickButton'): void }>();

const props = defineProps<{
    isOutline: boolean
}>();
const handleClick = () => {
  emit('clickButton');
};
</script>

<template>
  <Button :outlined="props.isOutline" class="form-action-button" @click="handleClick">
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
