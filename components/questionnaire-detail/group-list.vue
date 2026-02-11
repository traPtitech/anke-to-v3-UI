<script lang="ts" setup>
import { useMe } from '~/composables/type-fetch/anke-to/client';

defineProps<{
  groups: { name: string; members: string[] }[];
}>();

const { data: me } = useMe();
</script>

<template>
  <span v-for="group in groups" :key="group.name" class="group-element">
    <span :class="{ highlighted: group.members.includes(me?.name || '') }">
      @{{ group.name }}
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
