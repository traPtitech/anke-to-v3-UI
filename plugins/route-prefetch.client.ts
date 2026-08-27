export const withoutAppBase = (pathname: string, baseURL: string) => {
  const basePath = baseURL.replace(/\/+$/, '');
  if (basePath === '' || basePath === '/') return pathname;
  if (pathname === basePath) return '/';
  if (!pathname.startsWith(`${basePath}/`)) return;

  return pathname.slice(basePath.length);
};

export default defineNuxtPlugin(() => {
  const router = useRouter();
  const {
    app: { baseURL },
  } = useRuntimeConfig();

  const preloadTouchedRoute = (event: PointerEvent) => {
    if (!event.isPrimary || event.button !== 0 || event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;

    const target = event.target;
    if (!(target instanceof Element)) return;

    const anchor = target.closest<HTMLAnchorElement>('a[href]');
    if (!anchor || anchor.download || anchor.target === '_blank') return;

    const url = new URL(anchor.href, window.location.href);
    if (url.origin !== window.location.origin) return;

    const routePath = withoutAppBase(url.pathname, baseURL);
    if (routePath === undefined) return;
    const destination = `${routePath}${url.search}${url.hash}`;
    if (router.resolve(destination).matched.length === 0) return;

    void preloadRouteComponents(destination);
  };

  // NuxtLink's interaction prefetch starts on hover/focus. Pointerdown gives
  // touch navigation a head start without prefetching every visible route.
  document.addEventListener('pointerdown', preloadTouchedRoute, { capture: true, passive: true });

  if (import.meta.hot) {
    import.meta.hot.dispose(() => document.removeEventListener('pointerdown', preloadTouchedRoute, { capture: true }));
  }
});
