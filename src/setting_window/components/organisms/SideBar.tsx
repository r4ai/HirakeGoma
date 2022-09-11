import { useState, FC } from "react";
import { VStack, Box, LinkBox, Button, LinkOverlay, Center, Grid } from "@chakra-ui/react";
import { TbArrowBarLeft, TbArrowBarRight } from "react-icons/tb";
import { FiHome, FiTool } from "react-icons/fi";
import { IoPawOutline } from "react-icons/io5";
import { SideBarItem } from "../parts/SideBarItem";
import { navSize } from "../Layout";

interface Props {
  navSize: navSize;
}

export const SideBar: FC<Props> = ({ navSize }) => {
  return (
    <>
      <VStack spacing={0.5}>
        <SideBarItem icon={<FiHome />} title="General" link="/general" />
        <SideBarItem icon={<FiTool />} title="Debug" link="/debug" />
      </VStack>
    </>
  );
};
