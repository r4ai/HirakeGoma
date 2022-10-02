import { FC } from "react";

import { getAll } from "../../../../../commands/plugin/appsearch/getAll";
import { SettingItem, SettingItemButton } from "../../../parts/main";

export const Debug: FC = () => {
  async function handleClick(): Promise<void> {
    const items = getAll();
    await items.then((res) => {
      console.log(res);
    });
  }

  return (
    <SettingItem title="Debug" description="Print all items in PluginAppsearchTable">
      <SettingItemButton onClick={handleClick}>Print</SettingItemButton>
    </SettingItem>
  );
};
