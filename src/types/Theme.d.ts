import "@emotion/react";

declare module "@emotion/react" {
  interface Theme {
    mode: "dark" | "light";
    fonts: Fonts;
    colors: Colors;
  }
}

interface Colors {
  accentColor: string;
  textColor: string;
  descriptionTextColor: string;
  lineColor: string;
  backgroundColor: string;
  inputBoxBackgroundColor: string;
}

interface Fonts {
  inputBoxFont: string;
  titleFont: string;
  descriptionFont: string;
  codeFont: string;
}

interface Themes {
  [index: string]: Theme;
}
