import { Input } from "@chakra-ui/react";
import { FC, useState } from "react";

import { removeTheme } from "../../../../../commands/setting/theme";
import { SettingItem } from "../../../parts/main";

export const Remove: FC = () => {
  const [themeName, setThemeName] = useState("");
  async function handleSubmit(): Promise<void> {
    await removeTheme(themeName);
  }

  return (
    <SettingItem title="REMOVE PRESET" description="Remove preset.">
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
  );
};
