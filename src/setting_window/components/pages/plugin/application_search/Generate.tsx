import { FC } from "react";

import { generateIndex } from "../../../../../commands/plugin/appsearch/generateIndex";
import { SettingItem, SettingItemButton } from "../../../parts/main";

export const Generate: FC = () => {
  async function handleClick(): Promise<void> {
    await generateIndex();
  }

  return (
    <>
      <SettingItem title="Generate" description="Generate index in application table.">
        <SettingItemButton onClick={handleClick}>Generate</SettingItemButton>
      </SettingItem>
    </>
  );
};
