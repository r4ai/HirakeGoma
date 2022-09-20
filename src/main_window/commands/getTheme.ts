import { Theme } from "@emotion/react";

import { carbon, paper } from "../theme";

export const getTheme = (themeName: ThemeList): Theme => {
  switch (themeName) {
    case "carbon":
      return carbon;
    case "paper":
      return paper;
    default:
      return carbon;
  }
};
