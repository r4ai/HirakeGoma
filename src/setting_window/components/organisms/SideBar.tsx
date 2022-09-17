import { VStack, Box, LinkBox, Button, LinkOverlay, Center, Grid } from "@chakra-ui/react";
import { useState, FC } from "react";
import { FaRegKeyboard } from "react-icons/fa";
import { FiHome, FiTool, FiDatabase } from "react-icons/fi";
import { HiOutlinePuzzle } from "react-icons/hi";
import { MdOutlineColorLens } from "react-icons/md";
import { TbArrowBarLeft, TbArrowBarRight } from "react-icons/tb";

import { navSize } from "../Layout";
import { SideBarItem } from "../parts/SideBarItem";

interface Props {
  navSize: navSize;
}

export const SideBar: FC<Props> = ({ navSize }) => {
  return (
    <>
      <VStack spacing={0.5}>
        <SideBarItem icon={<FiHome />} title="General" link="/general" />
        <SideBarItem icon={<MdOutlineColorLens />} title="Theme" link="/theme" />
        <SideBarItem icon={<HiOutlinePuzzle />} title="Plugin" link="/plugin" />
        <SideBarItem icon={<FiDatabase />} title="Database" link="/database" />
        <SideBarItem icon={<FaRegKeyboard />} title="Hotkey" link="/hotkey" />
        <SideBarItem icon={<FiTool />} title="Debug" link="/debug" />
      </VStack>
    </>
  );
};
