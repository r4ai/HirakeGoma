// eslint-disable-next-line
import { useToast } from "@chakra-ui/react";
import { invoke } from "@tauri-apps/api";
import { Select } from "chakra-react-select";
import { FC, useContext, useEffect, useState } from "react";

import { settingThemeActivate, settingThemeGetAll } from "../../../../../commands/setting";
import { Themes } from "../../../../../types/Theme";
import { SettingItem } from "../../../parts/main";
import { ActivatedThemeContext } from "../Theme";

export const SelectTheme: FC = () => {
  const [themeList, setThemeList] = useState<Themes>({});
  const { activatedTheme, setActivatedTheme } = useContext(ActivatedThemeContext);
  const toast = useToast();

  type Option = {
    label: string;
    value: string;
  } | null;
  type Options = Option[];

  useEffect(() => {
    void settingThemeGetAll().then((res) => {
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
    const themes: Themes = await settingThemeGetAll();
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
          void settingThemeActivate(e?.value).catch(() => {
            toast({
              title: `Failed to change theme.`,
              description: `Failed to change the theme to ${e?.value}.`,
              status: "error",
              duration: 9000,
              isClosable: true
            });
          });
          if (e?.value === undefined) {
            console.log("error");
            toast({
              title: `Failed to change theme.`,
              description: `Failed to change the theme to ${e?.value}.`,
              status: "error",
              duration: 9000,
              isClosable: true
            });
          } else {
            setActivatedTheme(e?.value);
            toast({
              title: `Theme changed.`,
              description: `Successfully change the theme to ${e?.value}.`,
              status: "success",
              duration: 4000,
              isClosable: true
            });
          }
        }}
      ></Select>
    </SettingItem>
  );
};
