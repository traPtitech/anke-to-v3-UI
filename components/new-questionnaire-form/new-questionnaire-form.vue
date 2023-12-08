<script lang="ts" setup>
const { state } = useStoreNewQuestionnaireForm();
</script>

<template>
  <div>
    <div class="questions-container">
      <div v-for="(question, i) in state.questions" :key="question.id">
        <FormControl
          :model-value="question"
          @update:model-value="Object.assign(state.questions[i], $event)"
        />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.questions-container {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
</style>
