import { Input } from "@chakra-ui/react";
import { FC, useState } from "react";

import { SettingItem } from "../../../parts/main";

export const Create: FC = () => {
  const [theme, setTheme] = useState({});
  return (
    <>
      <SettingItem title="CREATE PRESET" description="Create new preset.">
        <Input size="sm" placeholder="Application Name"></Input>
      </SettingItem>
    </>
  );
};
