<script lang="ts" setup>
const props = defineProps<{
  grid?: boolean;
}>();
</script>

<template>
  <div
    :class="
      props.grid ? 'questionnaire-grid-container' : 'questionnaire-container'
    "
  >
    <slot />
  </div>
</template>

<style scoped lang="scss">
.questionnaire-grid-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 0;
}

.questionnaire-container {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 0;
}
</style>
