import { FC } from "react";

import { SettingItem, SettingItemButton } from "../../../parts/main";

export const ToggleSideBar: FC = () => {
  return (
    <SettingItem title="TOGGLE SIDEBAR" description="Toggle sideBar width between small and large. TODO:">
      <SettingItemButton onClick={() => {}}>Toggle width(currently, this is FAKE button)</SettingItemButton>
    </SettingItem>
  );
};
