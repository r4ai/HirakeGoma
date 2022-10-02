import { themes } from "@storybook/theming";

export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/
    }
  },
  darkMode: {
    dark: { ...themes.dark, appBg: "#1e2021" },
    light: { ...themes.normal, appBg: "white" }
  }
};
