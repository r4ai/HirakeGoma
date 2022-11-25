import { FC } from "react";

import { SettingHeading } from "../../parts/main";
import { Quit, Relaunch } from "./app";
import { Print, Insert, Reset, Search } from "./database";
import { GenerateIndex } from "./plugin";
import { ColorMode, ToggleSideBar } from "./theme";

export const Debug: FC = () => {
  return (
    <>
      <SettingHeading title="Database" />
      <Search />
      <Print />
      <Insert />
      <Reset />
      <SettingHeading title="Theme" />
      <ColorMode />
      <ToggleSideBar />
      <SettingHeading title="App" />
      <Quit />
      <Relaunch />
    </>
  );
};
