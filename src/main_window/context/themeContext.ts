// eslint-disable-next-line
import { Theme } from "@emotion/react";
import { createContext, useContext } from "react";

interface ThemeContextType {
  themeName: string;
  setTheme: () => void;
}

const defaultContext: ThemeContextType = {
  themeName: "carbon",
  setTheme: () => {}
};

export const ThemeContext = createContext<ThemeContextType>(defaultContext);
export const useTheme = () => useContext(ThemeContext);
