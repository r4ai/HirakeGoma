import { FC, useState, createContext } from "react";

import { SettingHeading } from "../../parts/main";
import { Create } from "./theme/Create";
import { GetAll } from "./theme/GetAll";
import { Remove } from "./theme/Remove";
import { SelectTheme } from "./theme/Select";

interface ActivatedThemeContextProps {
  activatedTheme: string;
  setActivatedTheme: Function;
}

export const ActivatedThemeContext = createContext<ActivatedThemeContextProps>({
  activatedTheme: "",
  setActivatedTheme: () => {}
});

export const Theme: FC = () => {
  const [activatedTheme, setActivatedTheme] = useState("paper");

  return (
    <>
      <ActivatedThemeContext.Provider value={{ activatedTheme, setActivatedTheme }}>
        <SettingHeading title="Theme" />
        <SelectTheme />
        <Create />
        <Remove />
        <GetAll />
      </ActivatedThemeContext.Provider>
    </>
  );
};
