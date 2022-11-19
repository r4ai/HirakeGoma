import { FC, useState } from "react";

import { settingThemeGetAll } from "../../../../../commands/setting";
import { Themes } from "../../../../../types/Theme";
import { SettingItem, SettingItemButton } from "../../../parts/main";

export const GetAll: FC = () => {
  const [themeList, setThemeList] = useState<Themes>({});

  function handleClick(): void {
    void settingThemeGetAll().then((res) => {
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
