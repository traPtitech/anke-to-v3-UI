import { getTraqAuthCodeRequestUrl } from '@/utils/sendTraqAuthCodeRequest';

export default defineNuxtRouteMiddleware(async (to, from) => {
  if (process.server) return;

  if (to.path === '/') return;

  const { state, actions } = useTraqAuthStore();

  if (to.path === '/auth-callback') {
    const clearSessionStorage = () => {
      sessionStorage.removeItem('nextRoute');
      sessionStorage.removeItem('previousRoute');
      sessionStorage.removeItem(`traq-auth-code-verifier-${authState}`);
    };

    const authCode = to.query.code;
    const authState = to.query.state;
    const codeVerifier = sessionStorage.getItem(
      `traq-auth-code-verifier-${authState}`,
    );
    if (typeof authCode !== 'string' || codeVerifier === null) {
      const previousRoute = sessionStorage.getItem('previousRoute') ?? '/';
      clearSessionStorage();
      return navigateTo(previousRoute);
    }

    const res = await sendTraqAuthTokenRequest(authCode, codeVerifier);
    const data = await res.json();
    state.accessToken = data.access_token;

    const nextRoute = sessionStorage.getItem('nextRoute') ?? '/';
    clearSessionStorage();
    return navigateTo(nextRoute);
  }

  if (!state.me) {
    await actions.getMe();
  }

  await actions.ensureToken();
  if (state.accessToken === null) {
    const message =
      'アンケートの編集・作成にはtraQアカウントへのアクセスが必要です。OKを押すとtraQに飛びます。';
    if (window.confirm(message)) {
      sessionStorage.setItem('nextRoute', to.path); // traQでのトークン取得後に飛ばすルート
      sessionStorage.setItem('previousRoute', from.path); // traQでのトークン取得失敗時に飛ばすルート

      const url = getTraqAuthCodeRequestUrl();
      return navigateTo(url, { external: true });
    } else {
      // キャンセルを押された場合は元のルートに戻る
      if (from.path !== to.path) {
        return navigateTo(from.path);
      }

      // url直打ちなどでアクセスされた場合
      return navigateTo('/');
    }
  }
});
