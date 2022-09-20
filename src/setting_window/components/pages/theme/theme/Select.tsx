import { Button, Menu, MenuButton, MenuItem, MenuList } from "@chakra-ui/react";
import { FC } from "react";
import { FiChevronDown } from "react-icons/fi";

import { SettingItem } from "../../../parts/main";

export const Select: FC = () => {
  return (
    <SettingItem title="SELECT PRESET" description="Select the theme preset.">
      <Menu>
        <MenuButton as={Button} w="-webkit-fit-content" rightIcon={<FiChevronDown />}>
          Select
        </MenuButton>
        <MenuList>
          <MenuItem>Carbon</MenuItem>
          <MenuItem>Paper</MenuItem>
        </MenuList>
      </Menu>
    </SettingItem>
  );
};
