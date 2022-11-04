import { FC, useState, createContext, useEffect } from "react";

import { getActivatedTheme } from "../../../../commands/setting/theme";
import { SettingHeading } from "../../parts/main";
import { Create } from "./theme/Create";
import { Edit } from "./theme/Edit";
import { GetAll } from "./theme/GetAll";
import { Remove } from "./theme/Remove";
import { Save } from "./theme/Save";
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
  const [activatedTheme, setActivatedTheme] = useState("");

  useEffect(() => {
    void getActivatedTheme().then((name) => {
      console.log(name);
      setActivatedTheme(name);
    });
  }, []);

  return (
    <>
      <ActivatedThemeContext.Provider value={{ activatedTheme, setActivatedTheme }}>
        <SettingHeading title="Theme" />
        <SelectTheme />
        <Create />
        <Edit />
        <Remove />
        <GetAll />
        <Save />
      </ActivatedThemeContext.Provider>
    </>
  );
};
