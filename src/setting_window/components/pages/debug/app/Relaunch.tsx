import { relaunch } from "@tauri-apps/api/process";
import { FC } from "react";

import { SettingItem, SettingItemButton } from "../../../parts/main";

export const Relaunch: FC = () => {
  async function relaunchApp(): Promise<void> {
    await relaunch();
  }
  return (
    <SettingItem title="RELAUNCH" description="Relaunch this application.">
      <SettingItemButton
        onClick={() => {
          void relaunchApp();
        }}
      >
        Relaunch
      </SettingItemButton>
    </SettingItem>
  );
};
