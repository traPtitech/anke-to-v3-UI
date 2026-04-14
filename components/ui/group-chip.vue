<script setup lang="ts">
import Chip from './chip.vue';

const props = withDefaults(
  defineProps<{
    name: string;
    highlighted?: boolean;
    prefixAt?: boolean;
  }>(),
  {
    highlighted: false,
    prefixAt: true,
  },
);
</script>

<template>
  <Chip :highlighted="props.highlighted">
    <Icon name="mdi:account-group" size="14px" class="group-chip-icon" />
    <span>
      {{ props.prefixAt ? '@' + props.name : props.name }}
    </span>
  </Chip>
</template>

<style lang="scss" scoped>
.group-chip-icon {
  color: var(--p-text-muted-color);
}
</style>
