import { FC } from "react";

import { SettingHeading } from "../../parts/main";
import { UploadToMainTable, Debug, FolderPaths, Generate, GetAll } from "./application_search";

export const Plugin: FC = () => {
  return (
    <>
      <SettingHeading title="Application Search" />
      <FolderPaths />
      <Generate />
      <UploadToMainTable />
      <GetAll />
      <Debug />
    </>
  );
};
