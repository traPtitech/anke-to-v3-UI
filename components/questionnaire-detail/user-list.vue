<script lang="ts" setup>
import { useMe } from '~/composables/type-fetch/anke-to/client';

defineProps<{
  users: string[];
}>();

const { data: me } = useMe();
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
