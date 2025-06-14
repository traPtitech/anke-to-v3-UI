// https://nuxt.com/docs/api/configuration/nuxt-config

import { BrandPreset } from "./theme/preset";

export default defineNuxtConfig({
  modules: [
    "@pinia/nuxt",
    "@nuxt/test-utils",
    "@nuxt/eslint",
    "@nuxtjs/stylelint-module",
    "@pinia-plugin-persistedstate/nuxt",
    "@nuxt/icon",
    "@primevue/nuxt-module",
  ],
  ssr: false,
  components: [
    "~/components/layout-elements",
    "~/components/ui",
    "~/components/questionnaire-form",
    { path: "~/components/response-form-base", pathPrefix: false },
    { path: "~/components/questionnaire-result", pathPrefix: false },
    { path: "~/components/questionnaire-detail", pathPrefix: false },
    { path: "~/components/landing-page", pathPrefix: false },
    "~/components",
  ],
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
          additionalData: '@import "~/assets/style/variables.scss";',
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
