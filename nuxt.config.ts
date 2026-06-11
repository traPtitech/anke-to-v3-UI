import { BrandPreset } from './theme/preset';

export default defineNuxtConfig({
  modules: [
    '@pinia/nuxt',
    '@nuxt/test-utils',
    '@nuxt/eslint',
    'pinia-plugin-persistedstate/nuxt',
    '@nuxt/icon',
    '@primevue/nuxt-module',
  ],
  ssr: false,
  components: false,
  imports: {
    dirs: ['./utils'],
  },
  devtools: { enabled: true },
  css: ['ress', '~/assets/style/global.css', '~/assets/style/hljs-github.css'],
  compatibilityDate: '2025-05-15',
  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: '@use "~/assets/style/variables";',
        },
      },
    },
  },
  typescript: {
    typeCheck: true,
  },
  eslint: {
    checker: false,
    config: {
      stylistic: true,
    },
  },
  icon: {
    mode: 'svg',
    clientBundle: {
      scan: true,
    },
  },
  primevue: {
    options: {
      theme: {
        preset: BrandPreset,
        options: {
          darkModeSelector: false,
        },
      },
    },
  },
});
