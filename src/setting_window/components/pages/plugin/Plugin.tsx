import { FC } from "react";

import { SettingHeading } from "../../parts/main";
import { UploadToMainTable, Debug, FolderPaths, Generate } from "./application_search";

export const Plugin: FC = () => {
  return (
    <>
      <SettingHeading title="Application Search" />
      <FolderPaths />
      <Generate />
      <UploadToMainTable />
      <Debug />
    </>
  );
};
