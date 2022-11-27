import { useColorMode } from "@chakra-ui/react";
import { FC } from "react";
import { generateIndex } from "../../../../../commands/plugin/appsearch/generateIndex";

import { SettingItem, SettingItemButton } from "../../../parts/main";

export const GenerateIndex: FC = () => {
  return (
    <SettingItem title="GENERATE INDEX" description="Generate indexes in SearchDatabaseApplicationTable.">
      <SettingItemButton onClick={() => generateIndex(false)}>generateIndex</SettingItemButton>
    </SettingItem>
  );
};
