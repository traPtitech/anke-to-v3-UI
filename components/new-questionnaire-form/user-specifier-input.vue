<script lang="ts" setup>
import { useFetchTraqApi } from '@/composables/type-fetch/traq/use-fetch-traq-api';
import type { UserSpecifier } from '~/components/new-questionnaire-form/type';

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

const { data: users } = useFetchTraqApi('/users');
const userIds = computed(() =>
  users.value
    ?.filter((user) => !user.bot)
    .map((user) => ({ label: user.name, value: user.name, id: user.id }))
    .toSorted((a, b) => a.label.localeCompare(b.label)),
);

const { data: groups } = useFetchTraqApi('/groups');
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
            :src="`https://q.trap.jp/api/v3/public/icon/${option.value}`"
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
