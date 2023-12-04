// https://nuxt.com/docs/api/configuration/nuxt-config

export default defineNuxtConfig({
  devtools: { enabled: true },
  css: ['ress'],
  typescript: {
    typeCheck: true,
  },
  modules: [
    '@nuxtjs/google-fonts',
    '@pinia/nuxt',
    'nuxt-vitest',
    '@nuxtjs/eslint-module',
    '@nuxtjs/stylelint-module',
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
});
