// @vitest-environment happy-dom

import type { MenuItem } from 'primevue/menuitem';
import { mount } from '@vue/test-utils';
import { describe, expect, it, vi } from 'vitest';
import ExplorerFilterToolbar from './explorer-filter-toolbar.vue';

const createWrapper = () => {
  const sortMenuItems: MenuItem[] = [
    {
      label: '並べ替え項目',
      items: [
        { label: '作成日時', command: vi.fn() },
        { label: '更新日時', command: vi.fn() },
        { label: 'タイトル', command: vi.fn() },
      ],
    },
    {
      label: '並び順',
      items: [
        { label: '古い順', command: vi.fn() },
        { label: '新しい順', command: vi.fn() },
      ],
    },
  ];

  return mount(ExplorerFilterToolbar, {
    attachTo: document.body,
    props: {
      sortMenuLabel: '作成日時 (新しい順)',
      sortMenuItems,
      onlyActiveDue: false,
      isFilterExpanded: false,
      isSortMenuItemSelected: (item) => item.label === '作成日時' || item.label === '新しい順',
    },
    global: {
      stubs: {
        NuxtIcon: true,
      },
    },
  });
};

describe('ExplorerFilterToolbar', () => {
  it('supports menu keyboard navigation and restores focus on Escape', async () => {
    const wrapper = createWrapper();
    const trigger = wrapper.get<HTMLButtonElement>('.sort-menu-trigger');

    await trigger.trigger('keydown', { key: 'ArrowDown' });

    const menuItems = wrapper.findAll<HTMLButtonElement>('[role="menuitemradio"]');
    expect(trigger.attributes('aria-expanded')).toBe('true');
    expect(menuItems[0]?.element).toBe(document.activeElement);
    expect(wrapper.findAll('[role="group"]')).toHaveLength(2);

    await menuItems[0]?.trigger('keydown', { key: 'ArrowDown' });
    expect(menuItems[1]?.element).toBe(document.activeElement);

    await menuItems[1]?.trigger('keydown', { key: 'End' });
    expect(menuItems.at(-1)?.element).toBe(document.activeElement);

    await menuItems.at(-1)?.trigger('keydown', { key: 'Escape' });
    expect(trigger.attributes('aria-expanded')).toBe('false');
    expect(trigger.element).toBe(document.activeElement);

    wrapper.unmount();
  });
});
