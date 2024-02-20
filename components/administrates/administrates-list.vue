<script lang="ts" setup>
const props = defineProps<{
  products: {
    title: string;
    response_due_date_time: string;
    modified_at: string;
    description: string;
    all_responded: boolean;
  }[];
}>();
const date = new Date('2023-12-24T00:00:00').getTime();
const now = new Date().getTime();
const remainingTime = date - now;
const test = formatRelativeDate(new Date('2023-12-24T00:00:00'));
</script>

<template>
  <div class="card">
    <div class="card-content">
      <div class="header">
        <h2>自分が管理者になっているアンケート</h2>
      </div>
      <div class="container">
        <a href="#">
          <ul v-for="(product, index) in products" :key="index">
            <div id="questionnaire">
              <div id="questionnaire_name">
                <h3>{{ product.title }}</h3>
              </div>
              <p id="deadline">
                回答期限：{{ product.response_due_date_time }}
              </p>
              <div id="remaining">
                <div v-if="remainingTime >= 0">
                  <p>{{ test }}</p>
                </div>
                <div v-else class="closed">
                  <p>回答期間終了</p>
                </div>
              </div>
              <p id="last_modified">最終更新日：{{ product.modified_at }}</p>
              <p id="description">
                {{ product.description }}
              </p>
              <div id="all_responded">
                <div v-if="product.all_responded == true">
                  <p>未回答者：なし</p>
                </div>
                <div v-else class="remaining_unresponded">
                  <p>未回答者：あり</p>
                </div>
              </div>
              <button id="show_answer">></button>
            </div>
          </ul>
        </a>
      </div>
    </div>
  </div>
</template>

<style scoped>
.card-content {
  margin-bottom: 20px;
}
.header {
  margin-bottom: 20px;
}
.container {
  position: relative;
}
.container a {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  color: inherit;
  text-decoration: none;
}

#questionnaire {
  display: grid;
  grid-template-rows: 40px 30px 30px 100px;
  grid-template-columns: 10px 1fr 1fr 70px;
  row-gap: 5px;
  column-gap: 5px;
  align-items: center;
  justify-content: left;
  width: 90%;
  padding-top: 10px;
  margin-bottom: 10px;
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
}
#remaining {
  grid-row: 2;
  grid-column: 3;
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
  justify-content: center;
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
.closed {
  font-weight: normal;
}

@media screen and (max-width: 1000px) {
  #questionnaire {
    grid-template-rows: 40px 60px 60px 150px;
  }
  #description {
    -webkit-line-clamp: 5;
  }
}
@media screen and (max-width: 600px) {
  #questionnaire {
    grid-template-rows: 40px 40px 40px 40px 40px 150px;
    grid-template-columns: 10px 1fr 50px;
    margin-left: 5%;
  }
  #questionnaire_name {
    grid-row: 1;
    grid-column: 2;
    margin-top: 10px;
    overflow: hidden;
  }
  #deadline {
    grid-row: 2;
    grid-column: 2;
  }
  #remaining {
    grid-row: 4;
    grid-column: 2;
    font-weight: bold;
  }
  #description {
    display: -webkit-box;
    grid-row: 6;
    grid-column: 2;
    overflow: hidden;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 5;
  }
  #last_modified {
    grid-row: 3;
    grid-column: 2;
  }
  #all_responded {
    grid-row: 5;
    grid-column: 2;
  }

  #show_answer {
    grid-row: 1 / 7;
    grid-column: 3;
    font-size: 2rem;
  }
}
</style>
