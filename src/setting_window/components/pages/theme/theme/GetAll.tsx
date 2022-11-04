import { FC, useState } from "react";

import { setting_theme_get_all } from "../../../../../commands/setting/theme/setting_theme_get_all";
import { Themes } from "../../../../../types/Theme";
import { SettingItem, SettingItemButton } from "../../../parts/main";

export const GetAll: FC = () => {
  const [themeList, setThemeList] = useState<Themes>({});

  function handleClick(): void {
    void setting_theme_get_all().then((res) => {
      setThemeList(res);
      console.log(res);
    });
  }

  return (
    <>
      <SettingItem title="PRINT PRESETS" description="Print presets list.">
        <SettingItemButton onClick={handleClick}>Print</SettingItemButton>
      </SettingItem>
    </>
  );
};
