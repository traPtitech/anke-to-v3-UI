import { BrandPreset } from './theme/preset';

export default defineNuxtConfig({
  modules: ['@pinia/nuxt', 'pinia-plugin-persistedstate/nuxt', '@nuxt/icon', '@primevue/nuxt-module'],
  ssr: false,
  components: false,
  imports: {
    dirs: ['./utils'],
  },
  devtools: { enabled: true },
  css: ['ress', '~/assets/style/global.css', '~/assets/style/hljs-github.css'],
  spaLoadingTemplate: 'spa-loading-template.html',
  experimental: {
    defaults: {
      nuxtLink: {
        // Loading a destination on intent keeps navigation fast without
        // competing with the initial route for bandwidth and main-thread time.
        prefetchOn: {
          visibility: false,
          interaction: true,
        },
      },
    },
  },
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
    typeCheck: false,
  },
  hooks: {
    'build:manifest': (manifest) => {
      // The SPA entry otherwise emits prefetch hints for every page, PrimeVue
      // component and the 500 KiB-gzip Markdown renderer in the initial HTML.
      for (const chunk of Object.values(manifest)) {
        chunk.prefetch = false;
      }
    },
  },
  icon: {
    mode: 'svg',
    clientBundle: {
      scan: true,
    },
  },
  primevue: {
    components: {
      include: [
        'Button',
        'Checkbox',
        'CheckboxGroup',
        'Column',
        'DataTable',
        'DatePicker',
        'Dialog',
        'InputNumber',
        'InputText',
        'Menu',
        'MultiSelect',
        'Paginator',
        'ProgressSpinner',
        'RadioButton',
        'Rating',
        'Select',
        'SelectButton',
        'Textarea',
        'Toast',
        'ToggleSwitch',
      ],
    },
    composables: {
      include: ['useToast'],
    },
    directives: {
      exclude: '*',
    },
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
