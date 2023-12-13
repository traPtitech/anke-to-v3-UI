<script lang="ts" setup>
import { ref } from "vue";
const products = ref();
defineProps({
  id: String,
  code: String,
  name: String,
  description: String,
  image: String,
  price: Number,
  category: String,
  quantity: Number,
  inventoryStatus: String,
  rating: Number,
});
products.value = [
  {
    id: '1000',
    code: 'f230fh0g3',
    name: 'Bamboo Watch',
    description: 'Product Description',
    image: 'bamboo-watch.jpg',
    price: 65,
    category: 'Accessories',
    quantity: 24,
    inventoryStatus: 'INSTOCK',
    rating: 5,
  },
];
</script>

<template>
  <div class="card">
    <div>
      <h3 class="header">下書き一覧</h3>
      <DataTable :value="products" removableSort>
        <Column
          field="code"
          header="anke-to名"
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
        <Column field="quantity" header="回答" style="width: 15%"></Column>
      </DataTable>
    </div>
    <div>
      <h3 class="header">回答済み一覧</h3>
      <DataTable :value="products" removableSort >
        <Column
          field="code"
          header="anke-to名"
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
        <Column field="quantity" header="回答" style="width: 15%"></Column>
      </DataTable>
    </div>
  </div>
</template>

<style>
.card {
  width: 90%;
  margin-left:5%;
}
.header {
  padding: 20px;
}
</style>
