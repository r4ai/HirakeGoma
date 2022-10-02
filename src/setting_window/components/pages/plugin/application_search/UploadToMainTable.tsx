import { FC } from "react";

import { uploadToMainTable } from "../../../../../commands/plugin/appsearch/uploadToMaintable";
import { SettingItem, SettingItemButton } from "../../../parts/main";

export const UploadToMainTable: FC = () => {
  async function handleClick(): Promise<void> {
    await uploadToMainTable();
  }

  return (
    <>
      <SettingItem title="Add to main table" description="copy items in application_table into main_table.">
        <SettingItemButton onClick={handleClick}>Copy</SettingItemButton>
      </SettingItem>
    </>
  );
};
