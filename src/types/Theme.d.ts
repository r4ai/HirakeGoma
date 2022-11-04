import "@emotion/react";

declare module "@emotion/react" {
  interface Theme {
    mode: "dark" | "light";
    activated: boolean;
    fonts: Fonts;
    colors: Colors;
  }
}

export interface Colors {
  accentColor: string;
  textColor: string;
  descriptionTextColor: string;
  lineColor: string;
  backgroundColor: string;
  backgroundTransparency: number;
  inputBoxBackgroundColor: string;
  inputBoxBackgroundTransparency: number;
}

export interface Fonts {
  inputBoxFont: string;
  titleFont: string;
  descriptionFont: string;
  codeFont: string;
}

export interface Themes {
  [index: string]: Theme;
}
