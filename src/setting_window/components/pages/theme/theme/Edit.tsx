import { Input } from "@chakra-ui/react";
import { Select } from "chakra-react-select";
import { FC, useEffect, useState } from "react";
import { createTheme, getAllTheme } from "../../../../../commands/setting/theme";
import { Themes } from "../../../../../types/Theme";
import { SettingItem } from "../../../parts/main";

export const Edit: FC = () => {
  const [themeName, setThemeName] = useState("");
  const [themeList, setThemeList] = useState<Themes>({});

  useEffect(() => {
    void getAllTheme().then(setThemeList);
  }, []);

  function convert(themes: Themes): Options {
    const res: Options = [];
    for (const item in themes) {
      res.push({ label: item, value: item });
    }
    return res;
  }

  async function handleSubmit(): Promise<void> {
    await createTheme(themeName);
  }

  return (
    <>
      <SettingItem title="EDIT PRESET" description="Edit presets.">
        <Select size="sm" placeholder="Select Preset..." options={convert(themeList)}></Select>
        {/* <Input
          size="sm"
          value={themeName}
          placeholder="Preset Name"
          onChange={(e) => {
            setThemeName(e.target.value);
          }}
          onKeyUp={(e) => {
            if (e.key === "Enter") {
              void handleSubmit();
              setThemeName("");
            }
          }}
        ></Input> */}
      </SettingItem>
    </>
  );
};
