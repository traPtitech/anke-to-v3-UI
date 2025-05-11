<script lang="ts" setup>
const checked = ref(false);
</script>

<template>
  <div>
    <Checkbox v-model="checked" :binary="true" />
  </div>
</template>

<style lang="scss" scoped></style>
