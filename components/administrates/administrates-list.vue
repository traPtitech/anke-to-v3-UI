<script lang="ts" setup>
const date = new Date("2023-12-23T00:00:00").getTime();
const now = new Date().getTime();
const remainingTime = date - now;
const remainingDays = Math.floor(remainingTime / (1000*60*60*24));
const props = defineProps<{
  products: {
    title: string;
    response_due_date_time: string;
    modified_at: string;
    description: string;
    all_responded: boolean;
  }[];
}>();
</script>

<template>
  <div class="card">
    <div class="card-content">
      <h2>自分が管理者になっているアンケート</h2>
      <ul v-for="(product, index) in products" :key="index">
        <div id="container">
          <div id="questionnaire_name">
            <h3>{{ product.title }}</h3>
          </div>
          <p id="deadline">回答期限：{{ product.response_due_date_time }}</p>
          <div id="remaining">
          <div v-if="remainingTime>= 0">
          <p>残り{{ remainingDays }}日</p></div>
          <div v-else class="closed">
            <p>回答期間終了</p>
          </div>
          </div>
          <p id="last_modified">最終更新日：{{ product.modified_at }}</p>
          <p id="description">
            {{ product.description }}
          </p>
          <p id="all_responded">
            <div v-if="product.all_responded == true">未回答者：なし</div>
            <div v-else class="remaining_unresponded" >未回答者：あり</div>
          </p>
          <button id="show_answer">></button>
        </div>
      </ul>
    </div>
  </div>
</template>

<style scoped>
.card-content {
  margin-bottom:2000px ;  
}
#container {
  display: grid;
  grid-template-rows: 40px 30px 30px 100px;
  grid-template-columns: 10px 1fr 1fr 70px;
  row-gap: 5px;
  column-gap: 5px;
  align-items: center;
  justify-content: left;
  width: 90%;
  margin-top: 20px;
  margin-left: 2%;
  border: 1px solid #000;
  border-radius: 5px;
}
#questionnaire_name {
  grid-row: 1;
  grid-column: 2 / 4;
  margin-top: 10px;
  overflow: hidden;
}
#deadline {
  grid-row: 2/3;
  grid-column: 2;
  margin-top: 15px;
}
#remaining {
  grid-row: 2;
  grid-column: 3;
  margin-top: 15px;
  font-weight: bold;
}
#description {
  display: -webkit-box;
  grid-row: 4;
  grid-column: 2 / 4;
  overflow: hidden;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 3;
}
#show_answer {
  grid-row: 1 / 5;
  grid-column: 4;
  font-size: 2rem;
}
#last_modified {
  grid-row: 3;
  grid-column: 2 / 3;
}
#all_responded {
  grid-row: 3;
  grid-column: 3 / 4;
}
.remaining_unresponded {
  font-weight: bold;
}
.closed{
  font-weight: normal;
}
</style>
