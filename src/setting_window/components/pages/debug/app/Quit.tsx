import { exit } from "@tauri-apps/api/process";
import { FC } from "react";

import { SettingItem, SettingItemButton } from "../../../parts/main";

export const Quit: FC = () => {
  async function quitApp(): Promise<void> {
    await exit(0);
  }
  return (
    <SettingItem title="QUIT" description="Quit this application.">
      <SettingItemButton
        onClick={() => {
          void quitApp();
        }}
      >
        Quit
      </SettingItemButton>
    </SettingItem>
  );
};
