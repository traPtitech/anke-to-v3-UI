<script lang="ts" setup>
const props = defineProps<{
  products: {
    questionnaire_id: number;
    submitted_at: string;
    modified_at: string;
    response_id: number;
  }[];
}>();
</script>

<template>
  <div class="card">
    <div>
      <h3 class="header">下書き一覧</h3>
      <DataTable :value="products" removable-sort>
        <Column
          field="questionnaire_id"
          header="アンケート名"
          sortable
          style="width: 41%"
        ></Column>
        <Column
          field="name"
          header="回答期限"
          sortable
          style="width: 22%"
        ></Column>
        <Column
          field="modified_at"
          header="最終更新日時"
          sortable
          style="width: 22%"
        ></Column>
        <button>
        <Column field='response_id' header="回答" style="width: 15%"></Column>
        </button>
      </DataTable>
    </div>
    <div>
      <h3 class="header answered">回答済み一覧</h3>
      <DataTable :value="products" removable-sort>
        <Column
          field="code"
          header="アンケート名"
          sortable
          style="width: 41%"
        ></Column>
        <Column
          field="name"
          header="回答期限"
          sortable
          style="width: 22%"
        ></Column>
        <Column
          field="category"
          header="最終更新日時"
          sortable
          style="width: 22%"
        ></Column>
        <Column field="https://anke-to.trap.jp/responses/" + responses_id header="回答" style="width: 15%"></Column>
      </DataTable>
    </div>
  </div>
</template>

<style>
.card {
  width: 90%;
  margin-left: 5%;
}
.header {
  padding: 20px;
}
.answered {
  margin-top: 44px;
}
</style>
