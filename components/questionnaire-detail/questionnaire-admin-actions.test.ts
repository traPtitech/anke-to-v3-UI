// @vitest-environment nuxt

import { mountSuspended } from '@nuxt/test-utils/runtime';
import { flushPromises } from '@vue/test-utils';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import QuestionnaireAdminActions from './questionnaire-admin-actions.vue';
import type { QuestionnaireDetail } from './type';

const { add, closeQuestionnaire } = vi.hoisted(() => ({ add: vi.fn(), closeQuestionnaire: vi.fn() }));

vi.mock('primevue/usetoast', () => ({ useToast: () => ({ add }) }));
vi.mock('~/composables/type-fetch/anke-to/client', () => ({
  useMe: () => ({ data: { value: { name: 'admin' } } }),
  closeQuestionnaire,
}));

const detail: QuestionnaireDetail = {
  questionnaire_id: 1,
  title: 'イベント参加アンケート',
  description: '',
  created_at: '2026-01-01T00:00:00Z',
  modified_at: '2026-01-01T00:00:00Z',
  is_published: true,
  is_anonymous: false,
  is_duplicate_answer_allowed: false,
  response_viewable_by: 'anyone',
  admin: { users: ['admin'], groups: [] },
  admins: ['admin'],
  target: { users: [], groups: [] },
  targets: [],
  questions: [],
  respondents: [],
};

describe('questionnaire close confirmation', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    closeQuestionnaire.mockResolvedValue(undefined);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it.each([false, true])('only closes after confirmation (confirmed: %s)', async (confirmed) => {
    const confirm = vi.fn(() => confirmed);
    vi.stubGlobal('confirm', confirm);
    const wrapper = await mountSuspended(QuestionnaireAdminActions, {
      props: { detail },
      global: {
        stubs: {
          Button: { template: '<button><slot /></button>' },
          ButtonLink: true,
          Icon: true,
        },
      },
    });
    const button = wrapper.get('button[aria-label="締め切る"]');
    expect(button.text()).toContain('締め切る');
    await button.trigger('click');
    await flushPromises();

    expect(confirm).toHaveBeenCalledOnce();
    expect(confirm).toHaveBeenCalledWith(expect.stringContaining(`「${detail.title}」を締め切りますか？`));
    if (confirmed) {
      expect(closeQuestionnaire).toHaveBeenCalledExactlyOnceWith(detail.questionnaire_id);
      expect(add).toHaveBeenCalledWith(expect.objectContaining({ severity: 'success' }));
    } else {
      expect(closeQuestionnaire).not.toHaveBeenCalled();
      expect(add).not.toHaveBeenCalled();
    }
    expect(button.attributes('disabled')).toBeUndefined();
    wrapper.unmount();
  });
});
