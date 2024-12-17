// https://nuxt.com/docs/api/configuration/nuxt-config

export default defineNuxtConfig({
  devtools: { enabled: true },
  css: ['ress', '~/assets/style/theme.css', '~/assets/style/global.css'],
  typescript: {
    typeCheck: true,
  },
  runtimeConfig: {
    public: {
      traQClientId: process.env.TRAQ_CLIENT_ID ?? '',
    },
  },
  components: [
    '~/components/layout-elements',
    '~/components/ui',
    '~/components/new-questionnaire-form',
    { path: '~/components/response-form-base', pathPrefix: false },
    { path: '~/components/questionnaire-result', pathPrefix: false },
    { path: '~/components/questionnaire-detail', pathPrefix: false },
    { path: '~/components/landing-page', pathPrefix: false },
    '~/components',
  ],
  modules: [
    '@nuxtjs/google-fonts',
    '@pinia/nuxt',
    '@nuxt/test-utils/module',
    '@nuxtjs/eslint-module',
    '@nuxtjs/stylelint-module',
    'nuxt-icon',
    'nuxt-primevue',
    '@pinia-plugin-persistedstate/nuxt',
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
