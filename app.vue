<script setup lang="ts">
import { provideMarkdownRenderer } from '~/components/ui/markdown/composables';

provideMarkdownRenderer();
</script>

<template>
  <NuxtLayout>
    <Toast position="bottom-right" />
    <NuxtPage />
  </NuxtLayout>
</template>

<style lang="scss">
html {
  font-family:
    -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif, 'Apple Color Emoji',
    'Segoe UI Emoji', 'Segoe UI Symbol';
  color: #4a3c3e;
}
</style>
