import { FC } from "react";

import { SettingHeading } from "../../parts/main";
import { Print, Insert, Reset, Search } from "./database";

export const Debug: FC = () => {
  return (
    <>
      <SettingHeading title="Database" />
      <Search />
      <Print />
      <Insert />
      <Reset />
      <SettingHeading title="Theme" />
    </>
  );
};
