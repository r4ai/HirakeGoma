import { FC } from "react";

import { getAllTheme } from "../../../../../commands/setting/theme/getAllTheme";
import { SettingItem, SettingItemButton } from "../../../parts/main";

export const GetAll: FC = () => {
  async function handleClick(): Promise<void> {
    await getAllTheme().then((msg) => console.log(msg));
  }

  return (
    <>
      <SettingItem title="PRINT PRESETS" description="Print presets list.">
        <SettingItemButton onClick={handleClick}>Print</SettingItemButton>
      </SettingItem>
    </>
  );
};
