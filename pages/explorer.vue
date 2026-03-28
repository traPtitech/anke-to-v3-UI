<script lang="ts" setup>
import { useRoute, useRouter } from 'vue-router';
import QuestionnaireList from '~/components/ui/questionnaire-list/questionnaire-list.vue';
import {
  fetchQuestionnaires,
  type GetQuestionnairesOption,
} from '~/composables/type-fetch/anke-to/client';
import type { components } from '~/composables/type-fetch/anke-to/openapi';
import {
  canViewResults,
  checkIsDueOver,
  formatResponseDueDateTime,
} from '~/models/questionnaire';

type GetQuestionnairesQuery = NonNullable<GetQuestionnairesOption>;
type QuestionnaireListResponse = components['schemas']['QuestionnaireList'];
const PAGE_SIZE = 20;

const route = useRoute();
const router = useRouter();

const keywordInput = ref((route.query.search as string) || '');
const keyword = ref((route.query.search as string) || '');
const filterTargetingMe = ref(route.query.onlyTargetingMe === 'true');
const filterAdministratedByMe = ref(
  route.query.onlyAdministratedByMe === 'true',
);
const filterHasMyResponse = ref(route.query.hasMyResponse === 'true');
const filterHasMyDraft = ref(route.query.hasMyDraft === 'true');
const filterNotOverDue = ref(route.query.notOverDue === 'true');
const filterUnpublishedOnly = ref(route.query.isDraft === 'true');
const sortKey = ref<
  | 'createdDesc'
  | 'createdAsc'
  | 'modifiedDesc'
  | 'modifiedAsc'
  | 'titleAsc'
  | 'titleDesc'
>((route.query.sort as any) || 'modifiedDesc');
const currentPage = ref(route.query.page ? Number(route.query.page) : 1);
let keywordDebounceTimer: ReturnType<typeof setTimeout> | null = null;

watch(keywordInput, (value) => {
  if (keywordDebounceTimer !== null) {
    clearTimeout(keywordDebounceTimer);
  }
  keywordDebounceTimer = setTimeout(() => {
    keyword.value = value;
  }, 300);
});

onBeforeUnmount(() => {
  if (keywordDebounceTimer !== null) {
    clearTimeout(keywordDebounceTimer);
  }
});

const sortOptions = [
  { label: '作成が新しい順', value: 'createdDesc' },
  { label: '作成が古い順', value: 'createdAsc' },
  { label: '更新が新しい順', value: 'modifiedDesc' },
  { label: '更新が古い順', value: 'modifiedAsc' },
  { label: 'タイトル昇順', value: 'titleAsc' },
  { label: 'タイトル降順', value: 'titleDesc' },
];

const apiSort = computed<GetQuestionnairesQuery['sort']>(() => {
  const sortMap = {
    createdDesc: '-created_at',
    createdAsc: 'created_at',
    modifiedDesc: '-modified_at',
    modifiedAsc: 'modified_at',
    titleAsc: 'title',
    titleDesc: '-title',
  } as const;
  return sortMap[sortKey.value];
});

const query = computed<GetQuestionnairesQuery>(() => ({
  page: currentPage.value,
  search: keyword.value.trim() || undefined,
  sort: apiSort.value,
  onlyTargetingMe: filterTargetingMe.value ? true : undefined,
  onlyAdministratedByMe: filterAdministratedByMe.value ? true : undefined,
  hasMyResponse: filterHasMyResponse.value ? true : undefined,
  hasMyDraft: filterHasMyDraft.value ? true : undefined,
  notOverDue: filterNotOverDue.value ? true : undefined,
  isDraft: filterUnpublishedOnly.value ? true : undefined,
}));

const queryKey = computed(
  () => `/questionnaires/explorer/${JSON.stringify(query.value)}`,
);

const { data, error, pending } = useAsyncData<QuestionnaireListResponse>(
  queryKey,
  async () => await fetchQuestionnaires(query.value),
  { watch: [query] },
);

const pageMax = computed(() => Math.max(1, data.value?.page_max ?? 1));
const currentQuestionnaires = computed(() => data.value?.questionnaires ?? []);

watch(
  [
    keyword,
    filterTargetingMe,
    filterAdministratedByMe,
    filterHasMyResponse,
    filterHasMyDraft,
    filterNotOverDue,
    filterUnpublishedOnly,
    sortKey,
  ],
  () => {
    currentPage.value = 1;
    updateQueryParams();
  },
);

watch(currentPage, () => {
  updateQueryParams();
});

function updateQueryParams() {
  router.replace({
    query: {
      ...(keyword.value ? { search: keyword.value } : {}),
      ...(filterTargetingMe.value ? { onlyTargetingMe: 'true' } : {}),
      ...(filterAdministratedByMe.value
        ? { onlyAdministratedByMe: 'true' }
        : {}),
      ...(filterHasMyResponse.value ? { hasMyResponse: 'true' } : {}),
      ...(filterHasMyDraft.value ? { hasMyDraft: 'true' } : {}),
      ...(filterNotOverDue.value ? { notOverDue: 'true' } : {}),
      ...(filterUnpublishedOnly.value ? { isDraft: 'true' } : {}),
      ...(sortKey.value !== 'modifiedDesc' ? { sort: sortKey.value } : {}),
      ...(currentPage.value !== 1 ? { page: String(currentPage.value) } : {}),
    },
  });
}

watch(pageMax, (max) => {
  if (currentPage.value > max) {
    currentPage.value = max;
  }
});

const resetFilters = () => {
  keywordInput.value = '';
  keyword.value = '';
  filterTargetingMe.value = false;
  filterAdministratedByMe.value = false;
  filterHasMyResponse.value = false;
  filterHasMyDraft.value = false;
  filterNotOverDue.value = false;
  filterUnpublishedOnly.value = false;
  sortKey.value = 'modifiedDesc';
  currentPage.value = 1;
};

const handlePageChange = (event: { page: number }) => {
  currentPage.value = event.page + 1;
};
</script>

<template>
  <div>
    <div v-if="error" class="error-message">
      {{ error.message }}
    </div>
    <div v-else-if="pending && !data">
      <p>Loading...</p>
    </div>
    <div v-else>
      <div class="explorer-filters">
        <div class="filter-row filter-row-keyword">
          <FloatLabel variant="on">
            <InputText
              id="keyword"
              v-model="keywordInput"
              class="filter-input"
            />
            <label for="keyword">タイトル・説明で検索</label>
          </FloatLabel>
        </div>

        <div class="filter-row filter-row-grid">
          <div class="filter-control switch-group">
            <div class="switch-group-title">回答まわり</div>
            <div class="switch-item">
              <label for="switch-targeting">自分が対象</label>
              <ToggleSwitch id="switch-targeting" v-model="filterTargetingMe" />
            </div>
            <div class="switch-item">
              <label for="switch-answered">自分が回答済み</label>
              <ToggleSwitch
                id="switch-answered"
                v-model="filterHasMyResponse"
              />
            </div>
            <div class="switch-item">
              <label for="switch-draft">自分の下書きあり</label>
              <ToggleSwitch id="switch-draft" v-model="filterHasMyDraft" />
            </div>
          </div>

          <div class="filter-control switch-group">
            <div class="switch-group-title">管理・公開状態</div>
            <div class="switch-item">
              <label for="switch-admin">自分が管理している</label>
              <ToggleSwitch
                id="switch-admin"
                v-model="filterAdministratedByMe"
              />
            </div>
            <div class="switch-item">
              <label for="switch-unpublished">未公開 (下書き)</label>
              <ToggleSwitch
                id="switch-unpublished"
                v-model="filterUnpublishedOnly"
              />
            </div>
            <div class="switch-item">
              <label for="switch-not-over-due">期限内</label>
              <ToggleSwitch
                id="switch-not-over-due"
                v-model="filterNotOverDue"
              />
            </div>
          </div>

          <div class="filter-control">
            <FloatLabel variant="on">
              <Select
                id="sort"
                v-model="sortKey"
                :options="sortOptions"
                option-label="label"
                option-value="value"
                class="filter-select"
              />
              <label for="sort">並び順</label>
            </FloatLabel>
          </div>
        </div>

        <div class="filter-footer">
          <div class="filter-summary">
            {{ currentPage }} / {{ pageMax }} ページ
          </div>
          <Button
            label="フィルタをリセット"
            icon="pi pi-filter-slash"
            severity="secondary"
            variant="text"
            @click="resetFilters"
          />
        </div>
      </div>

      <Paginator
        v-if="currentQuestionnaires.length > 0"
        class="explorer-paginator"
        :first="(currentPage - 1) * PAGE_SIZE"
        :rows="PAGE_SIZE"
        :total-records="pageMax * PAGE_SIZE"
        template="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink"
        @page="handlePageChange"
      />

      <QuestionnaireList :questionnaires="currentQuestionnaires">
        <template #tip="{ questionnaire }">
          <div class="questionnaire-card-tip">
            <Icon name="mdi:alarm" size="20px" />
            <span>
              {{ formatResponseDueDateTime(questionnaire) }}
            </span>
            <Icon
              v-if="canViewResults(questionnaire)"
              name="mdi:eye-check-outline"
              size="18px"
            />
          </div>
        </template>
        <template #action="{ questionnaire }">
          <NuxtLink
            v-if="!checkIsDueOver(questionnaire)"
            class="questionnaire-card-action-link"
            :to="`/questionnaires/${questionnaire.questionnaire_id}/responses/new`"
          >
            <Icon name="mdi:form-select" size="24px" />
            <span>アンケートに回答</span>
          </NuxtLink>
        </template>
      </QuestionnaireList>
      <Paginator
        v-if="currentQuestionnaires.length > 0"
        class="explorer-paginator"
        :first="(currentPage - 1) * PAGE_SIZE"
        :rows="PAGE_SIZE"
        :total-records="pageMax * PAGE_SIZE"
        template="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink"
        @page="handlePageChange"
      />
      <p
        v-if="!pending && currentQuestionnaires.length === 0"
        class="empty-result"
      >
        条件に一致するアンケートはありません。フィルタを緩めてみてください。
      </p>
    </div>
  </div>
</template>

<style scoped lang="scss">
.explorer-filters {
  border: 1px solid var(--p-surface-300);
  border-radius: var(--p-border-radius-md);
  padding: 16px;
  margin-bottom: 16px;
  background-color: var(--p-surface-50);
}

.filter-row {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.filter-row + .filter-row {
  margin-top: 12px;
}

.filter-row-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
}

.filter-control {
  min-width: 0;
}

.switch-group {
  border: 1px solid var(--p-surface-300);
  border-radius: var(--p-border-radius-md);
  padding: 12px;
  background-color: var(--p-surface-0);
}

.switch-group-title {
  font-size: 13px;
  font-weight: 700;
  color: var(--p-text-secondary);
  margin-bottom: 8px;
}

.switch-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.switch-item + .switch-item {
  margin-top: 8px;
}

.switch-item label {
  font-size: 14px;
}

.filter-input,
.filter-select {
  width: 100%;
}

.filter-footer {
  margin-top: 12px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.filter-summary {
  font-size: 13px;
  color: var(--p-text-secondary);
}

.empty-result {
  margin-top: 16px;
  color: var(--p-text-secondary);
}

.explorer-paginator {
  margin-top: 16px;
}

@media screen and (max-width: 1100px) {
  .filter-row-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media screen and (max-width: 780px) {
  .filter-row-grid {
    grid-template-columns: 1fr;
  }

  .filter-footer {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
