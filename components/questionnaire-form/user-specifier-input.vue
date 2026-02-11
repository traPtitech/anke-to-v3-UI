<script lang="ts" setup>
import { useGroups, useUsers } from '~/composables/type-fetch/anke-to/client';
import MultiSelectInput from './multi-select-input.vue';
import type { UserSpecifier } from './type';

const props = defineProps<{
  modelValue: UserSpecifier;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: UserSpecifier): void;
}>();

const userSpecifier = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
});

const { data: users } = useUsers();
const userIds = computed(() =>
  users.value
    ?.filter((user) => !user.is_bot)
    .map((user) => ({ label: user.name, value: user.name, id: user.id }))
    .toSorted((a, b) => a.label.localeCompare(b.label)),
);

const { data: groups } = useGroups();
const groupIds = computed(() =>
  groups.value
    ?.map((group) => ({ label: group.name, value: group.id }))
    .toSorted((a, b) => a.label.localeCompare(b.label)),
);
</script>

<template>
  <div class="multi-select-input-container">
    <MultiSelectInput
      v-model="userSpecifier.users"
      :options="userIds ?? []"
      placeholder="ユーザーを選択"
      class="multi-select-input"
    >
      <template #option="{ option }">
        <div class="user-option">
          <img
            :src="`https://image-proxy.trap.jp/icon/${option.value}?width=48&height=48&format=webp`"
            alt=""
            width="24"
            height="24"
          />
          <div>{{ option.label }}</div>
        </div>
      </template>
    </MultiSelectInput>
    <MultiSelectInput
      v-model="userSpecifier.groups"
      :options="groupIds ?? []"
      placeholder="グループを選択"
      class="multi-select-input"
    />
  </div>
</template>

<style lang="scss" scoped>
.multi-select-input-container {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.multi-select-input {
  min-width: 0;
}

.user-option {
  display: flex;
  align-items: center;
  gap: 8px;
}

.user-icon {
  width: 24px;
  height: 24px;
}
</style>
