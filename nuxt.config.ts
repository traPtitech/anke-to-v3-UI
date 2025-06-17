// https://nuxt.com/docs/api/configuration/nuxt-config

import { BrandPreset } from "./theme/preset";

export default defineNuxtConfig({
  modules: [
    "@pinia/nuxt",
    "@nuxt/test-utils",
    "@nuxt/eslint",
    "@nuxtjs/stylelint-module",
    "pinia-plugin-persistedstate/nuxt",
    "@nuxt/icon",
    "@primevue/nuxt-module",
  ],
  ssr: false,
  components: [
    {
      path: "~/components/layout-elements",
      pattern: "**/*.vue",
    },
    {
      path: "~/components/ui",
      pattern: "**/*.vue",
    },
    {
      path: "~/components/questionnaire-form",
      pathPrefix: false,
      pattern: "**/*.vue",
    },
    {
      path: "~/components/response-form",
      pathPrefix: false,
      pattern: "**/*.vue",
    },
    {
      path: "~/components/questionnaire-result",
      pathPrefix: false,
      pattern: "**/*.vue",
    },
    {
      path: "~/components/response-detail",
      pathPrefix: false,
      pattern: "**/*.vue",
    },
    {
      path: "~/components/questionnaire-detail",
      pathPrefix: false,
      pattern: "**/*.vue",
    },
    {
      path: "~/components/landing-page",
      pathPrefix: false,
      pattern: "**/*.vue",
    },
  ],
  imports: {
    dirs: [
      "./utils",
    ],
  },
  devtools: { enabled: true },
  css: ["ress", "~/assets/style/global.css"],
  appConfig: {
    nuxtIcon: {},
  },
  runtimeConfig: {
    public: {
      traQClientId: process.env.TRAQ_CLIENT_ID ?? "",
    },
  },
  compatibilityDate: "2025-05-15",
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
    checker: {
      cache: true,
    },
    config: {
      stylistic: true,
    },
  },
  pinia: {
    storesDirs: ["./stores/**"],
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
  stylelint: {
    cache: true,
  },
});
