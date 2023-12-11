import { defineStore } from 'pinia';

type AuthStore = {
  me: any;
  accessToken: string | null;
  accessTokenEnsured: boolean;
};

export const useTraqAuthStore = defineStore(
  'TraqAuth',
  () => {
    const state = ref<AuthStore>({
      me: null,
      accessToken: null,
      accessTokenEnsured: false,
    });

    const actions = {
      getMe: async (): Promise<boolean> => {
        if (state.value.accessToken === null) return false;
        const response = await fetch('https://q.trap.jp/api/v3/users/me', {
          headers: { Authorization: `Bearer ${state.value.accessToken}` },
          credentials: 'omit',
        });
        if (!response.ok) return false;

        const me = await response.json();
        state.value.me = me;

        return true;
      },
      ensureToken: async () => {
        if (state.value.accessToken === null) return;
        if (state.value.accessTokenEnsured) return;

        const success = await actions.getMe();
        if (!success) {
          state.value.accessToken = null;
          return;
        }

        state.value.accessTokenEnsured = true;
      },
    };

    return {
      state,
      actions,
    };
  },
  { persist: true },
);
