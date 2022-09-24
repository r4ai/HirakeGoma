// eslint-disable-next-line
import { Select } from "chakra-react-select";
import { FC, useEffect, useState } from "react";

import { getAllTheme } from "../../../../../commands/setting/theme";
import { Themes } from "../../../../../types/Theme";
import { SettingItem } from "../../../parts/main";

export const SelectTheme: FC = () => {
  const [themeList, setThemeList] = useState<Themes>({});

  type Options = Array<{
    label: string;
    value: string;
  }>;
  function convert(themes: Themes): Options {
    const res: Options = [];
    for (const item in themes) {
      res.push({ label: item, value: item });
    }
    return res;
  }

  useEffect(() => {
    void getAllTheme().then((res) => {
      setThemeList(res);
    });
  }, []);

  async function handleFocus(): Promise<void> {
    const themes: Themes = await getAllTheme();
    setThemeList(themes);
  }

  return (
    <SettingItem title="SELECT PRESET" description="Select the theme preset.">
      <Select size="sm" onFocus={handleFocus} options={convert(themeList)}></Select>
    </SettingItem>
  );
};
