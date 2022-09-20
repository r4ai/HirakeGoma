import { invoke } from "@tauri-apps/api";
import { FC } from "react";

import { SettingItem, SettingItemButton } from "../../../parts/main";

export const GetAll: FC = () => {
  async function handleClick(): Promise<void> {
    void invoke("setting_theme_get_all").then((msg) => {
      console.log(msg);
    });
  }

  return (
    <>
      <SettingItem title="GET ALL PRESETS" description="Print presets list.">
        <SettingItemButton onClick={handleClick}>Print</SettingItemButton>
      </SettingItem>
    </>
  );
};
