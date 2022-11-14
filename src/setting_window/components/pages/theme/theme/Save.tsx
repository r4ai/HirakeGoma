import { FC } from "react";

import { settingThemeSave } from "../../../../../commands/setting";
import { SettingItem, SettingItemButton } from "../../../parts/main";

export const Save: FC = () => {
  return (
    <SettingItem title="SAVE" description="Save changes to a file.">
      <SettingItemButton
        onClick={() => {
          void settingThemeSave();
        }}
      >
        Save
      </SettingItemButton>
    </SettingItem>
  );
};
