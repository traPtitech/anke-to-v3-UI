<script setup lang="ts">
import type {
  AdministrationScope,
  DraftScope,
  ExplorerAdvancedFilterState,
  ResponseScope,
  TargetScope,
} from './filter-types';

type SelectOption<T extends string> = {
  label: string;
  value: T;
};

const advancedFilterState = defineModel<ExplorerAdvancedFilterState>(
  'advancedFilterState',
  {
    required: true,
  },
);

const targetScope = computed<TargetScope>({
  get: () => advancedFilterState.value.targetScope,
  set: (value) => {
    advancedFilterState.value = {
      ...advancedFilterState.value,
      targetScope: value,
    };
  },
});

const responseScope = computed<ResponseScope>({
  get: () => advancedFilterState.value.responseScope,
  set: (value) => {
    advancedFilterState.value = {
      ...advancedFilterState.value,
      responseScope: value,
    };
  },
});

const draftScope = computed<DraftScope>({
  get: () => advancedFilterState.value.draftScope,
  set: (value) => {
    advancedFilterState.value = {
      ...advancedFilterState.value,
      draftScope: value,
    };
  },
});

const administrationScope = computed<AdministrationScope>({
  get: () => advancedFilterState.value.administrationScope,
  set: (value) => {
    advancedFilterState.value = {
      ...advancedFilterState.value,
      administrationScope: value,
    };
  },
});

const targetScopeOptions = [
  { label: 'フィルタなし', value: 'all' },
  { label: '自分が対象', value: 'targetingMe' },
] satisfies SelectOption<TargetScope>[];

const responseScopeOptions = [
  { label: 'フィルタなし', value: 'all' },
  { label: '自分が回答済み', value: 'answered' },
  { label: '自分が未回答', value: 'unanswered' },
] satisfies SelectOption<ResponseScope>[];

const draftScopeOptions = [
  { label: 'フィルタなし', value: 'all' },
  { label: '下書きあり', value: 'hasMyDraft' },
] satisfies SelectOption<DraftScope>[];

const administrationScopeOptions = [
  { label: 'フィルタなし', value: 'all' },
  { label: '管理中 (公開済み)', value: 'published' },
  { label: '管理中 (下書き)', value: 'draft' },
] satisfies SelectOption<AdministrationScope>[];
</script>

<template>
  <div class="advanced-filter-panel">
    <div class="advanced-filter-grid">
      <div class="advanced-filter-block">
        <div class="advanced-filter-title">対象</div>
        <SelectButton
          v-model="targetScope"
          :options="targetScopeOptions"
          option-label="label"
          option-value="value"
          :allow-empty="false"
          class="filter-select"
        />
      </div>

      <div class="advanced-filter-block">
        <div class="advanced-filter-title">回答状態</div>
        <SelectButton
          v-model="responseScope"
          :options="responseScopeOptions"
          option-label="label"
          option-value="value"
          :allow-empty="false"
          class="filter-select"
        />
      </div>

      <div class="advanced-filter-block">
        <div class="advanced-filter-title">下書き</div>
        <SelectButton
          v-model="draftScope"
          :options="draftScopeOptions"
          option-label="label"
          option-value="value"
          :allow-empty="false"
          class="filter-select"
        />
      </div>

      <div class="advanced-filter-block">
        <div class="advanced-filter-title">管理</div>
        <SelectButton
          v-model="administrationScope"
          :options="administrationScopeOptions"
          option-label="label"
          option-value="value"
          :allow-empty="false"
          class="filter-select"
        />
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.advanced-filter-panel {
  border-top: 1px solid var(--p-surface-300);
  padding: 14px 12px 12px;
  background-color: var(--p-surface-0);
}

.advanced-filter-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
}

.advanced-filter-title {
  margin-bottom: 8px;
  font-size: 13px;
  font-weight: 700;
  color: var(--p-text-secondary);
}

.filter-select {
  width: 100%;
}

:deep(.filter-select .p-togglebutton) {
  font-size: 14px;
  font-weight: 500;
}

@media screen and (max-width: 900px) {
  .advanced-filter-grid {
    grid-template-columns: 1fr;
  }
}

@media screen and (max-width: 560px) {
  .advanced-filter-panel {
    padding: 10px;
  }
}
</style>
