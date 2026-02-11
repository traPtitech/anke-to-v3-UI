<script lang="ts" setup>
import { useMarkdownRenderer } from './composables';

const props = defineProps<{
  content: string;
}>();

const { initialized, renderToHtml } = useMarkdownRenderer();
</script>

<template>
  <div class="markdown-block">
    <div v-if="initialized" v-html="renderToHtml(props.content)" />
  </div>
</template>

<style scoped>
.markdown-block :deep(h1),
.markdown-block :deep(h2),
.markdown-block :deep(h3),
.markdown-block :deep(h4),
.markdown-block :deep(h5),
.markdown-block :deep(h6) {
  margin-top: 1.5em;
  margin-bottom: 0.5em;
  font-weight: 600;
}

.markdown-block :deep(h1) {
  padding-bottom: 0.3em;
  font-size: 2em;
  border-bottom: 1px solid #eaecef;
}

.markdown-block :deep(h2) {
  padding-bottom: 0.3em;
  font-size: 1.5em;
  border-bottom: 1px solid #eaecef;
}

.markdown-block :deep(h3) {
  font-size: 1.25em;
}

.markdown-block :deep(p) {
  margin: 0.5em 0;
  line-height: 1.6;
}

.markdown-block :deep(a) {
  color: #0969da;
  text-decoration: none;
}

.markdown-block :deep(a:hover) {
  text-decoration: underline;
}

.markdown-block :deep(code) {
  padding: 0.2em 0.4em;
  font-family: monospace;
  font-size: 0.9em;
  background-color: #f6f8fa;
  border-radius: 3px;
}

.markdown-block :deep(pre) {
  padding: 1em;
  margin: 1em 0;
  overflow-x: auto;
  background-color: #f6f8fa;
  border-radius: 6px;
}

.markdown-block :deep(pre code) {
  padding: 0;
  background-color: transparent;
}

.markdown-block :deep(ul),
.markdown-block :deep(ol) {
  padding-left: 2em;
  margin: 0.5em 0;
}

.markdown-block :deep(li) {
  margin: 0.25em 0;
}

.markdown-block :deep(blockquote) {
  padding: 0 1em;
  margin: 0.5em 0;
  color: #666;
  border-left: 4px solid #ddd;
}

.markdown-block :deep(hr) {
  margin: 1.5em 0;
  border: none;
  border-top: 1px solid #eaecef;
}

.markdown-block :deep(mark) {
  background-color: #eee260;
}

.markdown-block :deep(table) {
  margin: 1em 0;
  border-collapse: collapse;
}

.markdown-block :deep(th),
.markdown-block :deep(td) {
  padding: 0.5em 1em;
  text-align: left;
  border: 1px solid #ddd;
}

.markdown-block :deep(th) {
  background-color: #f6f8fa;
}

.markdown-block :deep(.emoji) {
  display: inline-block;
  width: 1em;
  height: 1em;
  overflow: hidden;
  vertical-align: middle;
  color: transparent;
  text-indent: 999%;
  white-space: nowrap;
  background-repeat: no-repeat;
  background-position: center center;
  background-size: contain;
}
</style>
