import { Input } from "@chakra-ui/react";
import { FC, useState } from "react";

import { settingThemeCreate } from "../../../../../commands/setting";
import { SettingItem } from "../../../parts/main";

export const Create: FC = () => {
  const [themeName, setThemeName] = useState("");
  async function handleSubmit(): Promise<void> {
    await settingThemeCreate(themeName);
  }

  return (
    <>
      <SettingItem title="CREATE PRESET" description="Create new preset.">
        <Input
          size="sm"
          value={themeName}
          placeholder="Preset Name"
          onChange={(e) => {
            setThemeName(e.target.value);
          }}
          onKeyUp={(e) => {
            if (e.key === "Enter") {
              void handleSubmit();
              setThemeName("");
            }
          }}
        ></Input>
      </SettingItem>
    </>
  );
};
