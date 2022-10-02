import { FC } from "react";

import { saveTheme } from "../../../../../commands/setting/theme";
import { SettingItem, SettingItemButton } from "../../../parts/main";

export const Save: FC = () => {
  return (
    <SettingItem title="SAVE" description="Save changes to a file.">
      <SettingItemButton
        onClick={() => {
          void saveTheme();
        }}
      >
        Save
      </SettingItemButton>
    </SettingItem>
  );
};
