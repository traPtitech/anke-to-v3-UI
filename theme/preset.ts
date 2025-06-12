import { definePreset } from "@primeuix/themes";
import Lara from "@primeuix/themes/lara";

export const BrandPreset = definePreset(Lara, {
  components: {
    button: {
      colorScheme: {
        light: {
          outlined: {
            primary: {
              borderColor: "var(--p-primary-500)",
              hoverBackground: "var(--p-primary-50)",
              activeBackground: "var(--p-primary-100)",
            },
          },
        },
      },
    },
  },
  semantic: {
    primary: {
      50: "#fff3f3",
      100: "#ffdede",
      200: "#ffb3b3",
      300: "#f46e6e",
      400: "#df4b4b",
      500: "#b12929",
      600: "#9b2323",
      700: "#821d1d",
      800: "#6e1818",
      900: "#551212",
      950: "#3c0a0a",
    },
  },
});
