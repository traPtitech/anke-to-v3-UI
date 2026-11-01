<script lang="ts" setup>
const props = defineProps<{
  respondents: string[];
  actionLabel: string;
  showLabel?: boolean;
}>();

const toast = useToast();

const handleCopy = async () => {
  // 複数回答が許可されたアンケートでは同じ人が複数回現れるので重複を除く
  const uniqueRespondents = [...new Set(props.respondents)];
  const mentions = uniqueRespondents.map((u) => `@${u}`).join(' ');
  try {
    await navigator.clipboard.writeText(mentions);
    toast.add({
      severity: 'success',
      summary: `${uniqueRespondents.length}人の回答者をコピーしました`,
      life: 3000,
    });
  } catch {
    toast.add({
      severity: 'error',
      summary: 'コピーに失敗しました',
      life: 4000,
    });
  }
};
</script>

<template>
  <Button
    class="copy-respondents-button"
    severity="secondary"
    outlined
    :aria-label="props.actionLabel"
    :title="props.actionLabel"
    @click="handleCopy"
  >
    <Icon name="mdi:content-copy" size="14px" />
    <span v-if="props.showLabel">回答者をコピー</span>
  </Button>
</template>

<style lang="scss" scoped>
.copy-respondents-button {
  display: inline-flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 6px;
  font-size: 12px;
  white-space: nowrap;
}
</style>
