import { ThemeProvider } from "@emotion/react";
import { createContext, FC, ReactNode, useEffect, useState } from "react";

import { getAllTheme } from "../commands/setting/theme";
import { carbon } from "./theme/carbon";

interface Props {
  children: ReactNode;
}

export const ThemeManager: FC<Props> = ({ children }) => {
  const [themeName, setThemeName] = useState("carbon");
  const [theme, setTheme] = useState(carbon);
  const ThemeContext = createContext({ themeName, setThemeName });

  useEffect(() => {
    void getAllTheme().then((res) => {
      setTheme(res[themeName]);
    });

    return () => {
      /* クリーンアップ関数 */
    };
  }, [themeName]);

  return (
    <ThemeContext.Provider value={{ themeName, setThemeName }}>
      <ThemeProvider theme={theme}>{children}</ThemeProvider>
    </ThemeContext.Provider>
  );
};
