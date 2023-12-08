// https://nuxt.com/docs/api/configuration/nuxt-config

export default defineNuxtConfig({
  devtools: { enabled: true },
  css: [
    'ress',
    '~/assets/style/theme.css',
    'primeicons/primeicons.css',
    '~/assets/style/global.css',
  ],
  typescript: {
    typeCheck: true,
  },
  components: [
    '~/components/layout-elements',
    '~/components/ui',
    '~/components/new-questionnaire-form',
    '~/components',
  ],
  modules: [
    'nuxt-icon',
    '@nuxtjs/google-fonts',
    '@pinia/nuxt',
    'nuxt-vitest',
    '@nuxtjs/eslint-module',
    '@nuxtjs/stylelint-module',
    'nuxt-primevue',
  ],
  eslint: {
    cache: false,
  },
  stylelint: {
    cache: false,
  },
  googleFonts: {
    families: {
      Inter: [400, 500, 700],
      'M+PLUS+1p': [400, 500, 700],
    },
    preload: true,
    download: false,
  },
  pinia: {
    storesDirs: ['./stores/**'],
  },
  appConfig: {
    nuxtIcon: {},
  },
  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: '@import "~/assets/style/variables.scss";',
        },
      },
    },
  },
});
