<script lang="ts" setup>
import type { GatewayResponseWithQuestionnaire } from '~/models/response';
import { formatResponseSubmitDate } from '~/models/response';

const props = defineProps<{
  responses: GatewayResponseWithQuestionnaire[];
}>();
</script>

<template>
  <div class="response-list-container">
    <template
      v-for="responseWithQuestionnaire in props.responses"
      :key="responseWithQuestionnaire.responses[0].response_id"
    >
      <div
        v-for="response in responseWithQuestionnaire.responses"
        class="response-card"
      >
        <div class="response-card-title-container">
          <NuxtLink
            class="response-card-title"
            :to="`/responses/${response.response_id}`"
          >
            {{ responseWithQuestionnaire.questionnaire_info.title }}
          </NuxtLink>
          <div class="response-card-tip-section">
            <div class="response-card-tip">
              <span>
                {{ formatResponseSubmitDate(response) }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<style lang="scss" scoped>
.response-list-container {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.response-card {
  border: 1px solid var(--p-surface-300);
  border-radius: var(--p-border-radius-md);
  padding: 16px;
}

.response-card-title-container {
  display: flex;
  justify-content: space-between;
  gap: 4px;
}

.response-card-title {
  min-width: 0;
  flex: 1;
  font-weight: bold;
  font-size: 18px;
  color: variables.$color-primary;
  text-decoration: none;

  overflow: hidden;
  display: -webkit-box;
  text-overflow: ellipsis;
  -webkit-box-orient: vertical;
  max-height: 56px;
}

.response-card-title:hover {
  text-decoration: underline;
}

.response-card-tip-section {
  display: flex;
  gap: 4px;
}
</style>
