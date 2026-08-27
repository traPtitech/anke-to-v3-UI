import { BrandPreset } from './theme/preset';

export default defineNuxtConfig({
  modules: [
    '@pinia/nuxt',
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
