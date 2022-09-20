import { FC } from "react";

import { SettingHeading } from "../../parts/main";
import { Create } from "./theme/Create";
import { GetAll } from "./theme/GetAll";
import { Remove } from "./theme/Remove";
import { Select } from "./theme/Select";

export const Theme: FC = () => {
  return (
    <>
      <SettingHeading title="Theme" />
      <Select />
      <Create />
      <Remove />
      <GetAll />
    </>
  );
};
