<script setup lang="ts">
const filterTargetingMe = defineModel<boolean>('filterTargetingMe', {
  required: true,
});
const filterAdministratedByMe = defineModel<boolean>(
  'filterAdministratedByMe',
  {
    required: true,
  },
);
const filterHasMyResponse = defineModel<boolean>('filterHasMyResponse', {
  required: true,
});
const filterUnansweredByMe = defineModel<boolean>('filterUnansweredByMe', {
  required: true,
});
const filterHasMyDraft = defineModel<boolean>('filterHasMyDraft', {
  required: true,
});
const filterUnpublishedOnly = defineModel<boolean>('filterUnpublishedOnly', {
  required: true,
});

const targetingMeId = useId();
const administratedByMeId = useId();
const hasMyResponseId = useId();
const unansweredByMeId = useId();
const hasMyDraftId = useId();
const unpublishedOnlyId = useId();
</script>

<template>
  <div class="advanced-filter-panel">
    <div class="advanced-filter-grid">
      <div class="advanced-filter-block">
        <div class="advanced-filter-title">回答</div>
        <label class="advanced-switch-item" :for="targetingMeId">
          <Checkbox
            v-model="filterTargetingMe"
            :input-id="targetingMeId"
            binary
          />
          <span>自分が対象</span>
        </label>
        <label class="advanced-switch-item" :for="hasMyResponseId">
          <Checkbox
            v-model="filterHasMyResponse"
            :input-id="hasMyResponseId"
            binary
          />
          <span>自分が回答済み</span>
        </label>
        <label class="advanced-switch-item" :for="unansweredByMeId">
          <Checkbox
            v-model="filterUnansweredByMe"
            :input-id="unansweredByMeId"
            binary
          />
          <span>自分が未回答</span>
        </label>
        <label class="advanced-switch-item" :for="hasMyDraftId">
          <Checkbox
            v-model="filterHasMyDraft"
            :input-id="hasMyDraftId"
            binary
          />
          <span>自分の下書きあり</span>
        </label>
      </div>

      <div class="advanced-filter-block">
        <div class="advanced-filter-title">管理</div>
        <label class="advanced-switch-item" :for="administratedByMeId">
          <Checkbox
            v-model="filterAdministratedByMe"
            :input-id="administratedByMeId"
            binary
          />
          <span>自分が管理中</span>
        </label>
        <label class="advanced-switch-item" :for="unpublishedOnlyId">
          <Checkbox
            v-model="filterUnpublishedOnly"
            :input-id="unpublishedOnlyId"
            binary
          />
          <span>未公開 (下書き)</span>
        </label>
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

.advanced-filter-block {
  border: 1px solid var(--p-surface-300);
  border-radius: var(--p-border-radius-md);
  padding: 10px;
  background-color: var(--p-surface-0);
}

.advanced-filter-title {
  margin-bottom: 8px;
  font-size: 13px;
  font-weight: 700;
  color: var(--p-text-secondary);
}

.advanced-switch-item {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  cursor: pointer;
}

.advanced-switch-item + .advanced-switch-item {
  margin-top: 8px;
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
