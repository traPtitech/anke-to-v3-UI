<script lang="ts" setup>
defineProps<{
  users: string[];
}>();

const { state } = useTraqAuthStore();
const myID = ref(null);

// こうしないとサーバー側でプリレンダリングしたものがそのままつかわれちゃう
onMounted(() => {
  myID.value = state.me?.name;
});
</script>

<template>
  <span v-for="user in users" :key="user" class="user-element">
    <span :class="{ highlighted: myID === user }">
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
