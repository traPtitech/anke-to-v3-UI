<script lang="ts" setup>
defineProps<{
  users: string[];
}>();

const me = await useMe();
</script>

<template>
  <span v-for="user in users" :key="user" class="user-element">
    <span :class="{ highlighted: me?.name === user }">
      {{ '@' + user }}
    </span>
    {{ ' ' }}
  </span>
</template>

<style lang="scss" scoped>
.highlighted {
  background-color: #eee260;
  font-weight: bold;
}
</style>
