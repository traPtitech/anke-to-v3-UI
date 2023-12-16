<script lang="ts" setup>
import { FilterMatchMode } from 'primevue/api';
import { ref } from 'vue';

const props = defineProps<{
  customers: {
    title: string;
    response_due_date_time: string;
    modified_at: string;
    questionnaire_id: string;
  }[];
}>();
const filters = ref({
  global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  title: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
  response_due_date_time: {
    value: null,
    matchMode: FilterMatchMode.STARTS_WITH,
  },
  modified_at: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
  questionnaire_id: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
});
const loading = ref(false);
</script>

<template>
  <div class="card">
    <DataTable
      v-model:filters="filters"
      :value="customers"
      paginator
      :rows="10"
      data-key="id"
      filter-display="row"
      :loading="loading"
      :global-filter-fields="[
        'title',
        'response_due_date_time',
        'modified_at',
        'questionnaire_id',
      ]"
    >
      <template #header>
        <div class="flex justify-content-end">
          <span class="p-input-icon-left">
            <i class="pi pi-search" />
            <InputText
              v-model="filters['global'].value"
              placeholder="Keyword Search"
            />
          </span>
        </div>
      </template>
      <Column field="title" header="アンケート名">
        <template #body="{ data }">
          {{ data.title }}
        </template>
        <template #filter="{ filterModel, filterCallback }">
          <InputText
            v-model="filterModel.value"
            type="text"
            class="p-column-filter"
            placeholder="Search by name"
            @input="filterCallback()"
          />
        </template>
      </Column>

      <Column field="response_due_date_time" header="回答期限">
        <template #body="{ data }">
          {{ data.response_due_date_time }}
        </template>
        <template #filter="{ filterModel, filterCallback }">
          <InputText
            v-model="filterModel.value"
            type="text"
            class="p-column-filter"
            placeholder="Search by name"
            @input="filterCallback()"
          />
        </template>
      </Column>
      <Column field="modified_at" header="最終更新日時">
        <template #body="{ data }">
          {{ data.modified_at }}
        </template>
        <template #filter="{ filterModel, filterCallback }">
          <InputText
            v-model="filterModel.value"
            type="text"
            class="p-column-filter"
            placeholder="Search by name"
            @input="filterCallback()"
          />
        </template>
      </Column>
      <Column field="questionnaire_id" header="リンク">
        <template #body="{ data }">
          {{ data.questionnaire_id }}
        </template>
        <template #filter="{ filterModel, filterCallback }">
          <InputText
            v-model="filterModel.value"
            type="text"
            class="p-column-filter"
            placeholder="Search by name"
            @input="filterCallback()"
          />
        </template>
      </Column>
    </DataTable>
  </div>
</template>

<style></style>
