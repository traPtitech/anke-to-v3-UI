<script lang="ts" setup>
const props = defineProps<{ userId: string }>();

const { data: src } = await useAsyncData(
  `/users/${props.userId}/icon`,
  getUserIcon(props.userId),
  { server: false },
);
</script>

<template>
  <img :src="src ?? ''" />
</template>

<style lang="scss" scoped></style>
