import { FC } from "react";

import { setting_theme_save } from "../../../../../commands/setting/theme";
import { SettingItem, SettingItemButton } from "../../../parts/main";

export const Save: FC = () => {
  return (
    <SettingItem title="SAVE" description="Save changes to a file.">
      <SettingItemButton
        onClick={() => {
          void setting_theme_save();
        }}
      >
        Save
      </SettingItemButton>
    </SettingItem>
  );
};
