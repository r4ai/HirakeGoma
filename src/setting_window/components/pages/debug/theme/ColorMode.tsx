import { useColorMode } from "@chakra-ui/react";
import { FC } from "react";

import { SettingItem, SettingItemButton } from "../../../parts/main";

export const ColorMode: FC = () => {
  const { colorMode, toggleColorMode } = useColorMode();

  return (
    <SettingItem title="COLOR MODE" description="Toggle between dark and light modes.">
      <SettingItemButton onClick={toggleColorMode}>Toggle {colorMode === "light" ? "dark" : "light"}</SettingItemButton>
    </SettingItem>
  );
};
