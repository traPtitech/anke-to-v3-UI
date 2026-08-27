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
  icon: {
    mode: 'svg',
    clientBundle: {
      scan: true,
    },
  },
  primevue: {
    components: {
      include: [
        'Accordion',
        'AccordionContent',
        'AccordionHeader',
        'AccordionPanel',
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
