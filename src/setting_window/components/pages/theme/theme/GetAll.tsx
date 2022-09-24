import { FC, useState } from "react";

import { getAllTheme } from "../../../../../commands/setting/theme/getAllTheme";
import { Themes } from "../../../../../types/Theme";
import { SettingItem, SettingItemButton } from "../../../parts/main";

export const GetAll: FC = () => {
  const [themeList, setThemeList] = useState<Themes>({});

  function handleClick(): void {
    void getAllTheme().then((res) => {
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
