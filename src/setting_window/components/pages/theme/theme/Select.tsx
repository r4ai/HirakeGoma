// eslint-disable-next-line
import { invoke } from "@tauri-apps/api";
import { Select } from "chakra-react-select";
import { FC, useContext, useEffect, useState } from "react";

import { activateTheme, getAllTheme } from "../../../../../commands/setting/theme";
import { Themes } from "../../../../../types/Theme";
import { SettingItem } from "../../../parts/main";
import { ActivatedThemeContext } from "../Theme";

export const SelectTheme: FC = () => {
  const [themeList, setThemeList] = useState<Themes>({});
  const { activatedTheme, setActivatedTheme } = useContext(ActivatedThemeContext);

  type Option = {
    label: string;
    value: string;
  } | null;
  type Options = Option[];

  useEffect(() => {
    void getAllTheme().then((res) => {
      setThemeList(res);
    });
  }, []);

  function convert(themes: Themes): Options {
    const res: Options = [];
    for (const item in themes) {
      res.push({ label: item, value: item });
    }
    return res;
  }

  function getActivatedTheme(): Option {
    for (const nameI in themeList) {
      const itemI = themeList[nameI];
      if (itemI.activated) {
        console.log(nameI);
        return { label: nameI, value: nameI };
      }
    }
    return { label: "carbon", value: "carbon" };
  }

  async function handleFocus(): Promise<void> {
    const themes: Themes = await getAllTheme();
    setThemeList(themes);
  }

  return (
    <SettingItem title="SELECT PRESET" description={`Select the theme preset. ActivatedTheme: ${activatedTheme}`}>
      <Select
        size="sm"
        defaultValue={{ label: activatedTheme, value: activatedTheme }}
        onFocus={handleFocus}
        options={convert(themeList)}
        onChange={(e) => {
          void activateTheme(e?.value);
          if (e?.value === undefined) {
            console.log("error");
          } else {
            setActivatedTheme(e?.value);
          }
        }}
      ></Select>
    </SettingItem>
  );
};
