// @vitest-environment nuxt

import { mountSuspended } from '@nuxt/test-utils/runtime';
import { flushPromises } from '@vue/test-utils';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import CopyRespondentsButton from './copy-respondents-button.vue';

const { add } = vi.hoisted(() => ({ add: vi.fn() }));

vi.mock('primevue/usetoast', () => ({
  useToast: () => ({ add }),
}));

const writeText = vi.fn();

const clickButton = async (respondents: string[]) => {
  const wrapper = await mountSuspended(CopyRespondentsButton, {
    props: { respondents, actionLabel: '回答者をコピー' },
    global: {
      stubs: {
        Button: { template: '<button><slot /></button>' },
        Icon: true,
      },
    },
  });
  await wrapper.get('button').trigger('click');
  await flushPromises();
};

describe('CopyRespondentsButton', () => {
  beforeEach(() => {
    add.mockClear();
    writeText.mockReset();
    vi.stubGlobal('navigator', { clipboard: { writeText } });
  });

  it('copies respondents as space-separated mentions without duplicates', async () => {
    writeText.mockResolvedValue(undefined);

    await clickButton(['alice', 'bob', 'alice']);

    expect(writeText).toHaveBeenCalledWith('@alice @bob');
    expect(add).toHaveBeenCalledWith(
      expect.objectContaining({ severity: 'success', summary: '2人の回答者をコピーしました' }),
    );
  });

  it('shows an error toast when the clipboard write fails', async () => {
    writeText.mockRejectedValue(new Error('denied'));

    await clickButton(['alice']);

    expect(add).toHaveBeenCalledWith(expect.objectContaining({ severity: 'error' }));
  });
});
