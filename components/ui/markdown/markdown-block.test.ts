// @vitest-environment happy-dom

import { mount } from '@vue/test-utils';
import { ref } from 'vue';
import { describe, expect, it, vi } from 'vitest';
import MarkdownBlock from './markdown-block.vue';

const createRenderer = (options?: { initialized?: boolean; error?: Error }) => ({
  initialized: ref(options?.initialized ?? false),
  initializationError: ref(options?.error),
  initialize: vi.fn(),
  renderToHtml: vi.fn((content: string) => `<strong>${content}</strong>`),
});

const mountMarkdownBlock = (renderer: ReturnType<typeof createRenderer>) =>
  mount(MarkdownBlock, {
    props: {
      content: 'original markdown',
    },
    global: {
      provide: {
        markdownRenderer: renderer,
      },
    },
  });

describe('MarkdownBlock', () => {
  it('renders Markdown after initialization', async () => {
    const renderer = createRenderer({ initialized: true });
    const wrapper = mountMarkdownBlock(renderer);

    await vi.waitFor(() => expect(renderer.initialize).toHaveBeenCalledOnce());
    expect(wrapper.html()).toContain('<strong>original markdown</strong>');
  });

  it('shows readable plain text while the renderer is deferred', () => {
    const renderer = createRenderer();
    const wrapper = mountMarkdownBlock(renderer);

    expect(wrapper.get('.markdown-plain-text').text()).toBe('original markdown');
  });

  it('shows the original content and allows retrying after initialization fails', async () => {
    const renderer = createRenderer({ error: new Error('load failed') });
    const wrapper = mountMarkdownBlock(renderer);

    await vi.waitFor(() => expect(renderer.initialize).toHaveBeenCalledOnce());

    expect(wrapper.get('[role="alert"]').text()).toContain('Markdown の表示に失敗しました。');
    expect(wrapper.get('pre').text()).toBe('original markdown');

    renderer.initialize.mockClear();
    await wrapper.get('button').trigger('click');

    expect(renderer.initialize).toHaveBeenCalledOnce();
  });
});
