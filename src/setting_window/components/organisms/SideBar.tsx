import { VStack, Flex, Box, Image, Text, Center } from "@chakra-ui/react";
import { FC, useContext } from "react";
import { FaRegKeyboard } from "react-icons/fa";
import { FiHome, FiTool, FiDatabase } from "react-icons/fi";
import { HiOutlinePuzzle } from "react-icons/hi";
import { MdOutlineColorLens } from "react-icons/md";

// eslint-disable-next-line
import { TbArrowBarLeft, TbArrowBarRight } from "react-icons/tb";
import { createContext } from "vm";

import { navSize } from "../Layout";
import { SideBarProvider } from "../parts/nav";
import { SideBarItem } from "../parts/nav/SideBarItem";

interface Props {
  navSize: navSize;
}

export const SideBar: FC<Props> = ({ navSize }) => {
  return (
    <>
      <Flex alignItems="start" direction="column" h="100%" w="100%">
        <VStack spacing={0.5} w="100%">
          <Box textAlign="center" marginTop={4} marginBottom={4}>
            <Center marginBottom={1}>
              <Image src="../../../../public/hirake_goma.svg" alt="HirakeGoma application icon" boxSize="75%" />
            </Center>
            <Text as="b" fontSize="md">
              HirakeGoma
            </Text>
          </Box>
          <SideBarProvider>
            <SideBarItem icon={<FiHome />} title="General" link="/general" index={0} />
            <SideBarItem icon={<MdOutlineColorLens />} title="Theme" link="/theme" index={1} />
            <SideBarItem icon={<HiOutlinePuzzle />} title="Plugin" link="/plugin" index={2} />
            <SideBarItem icon={<FiDatabase />} title="Database" link="/database" index={3} />
            <SideBarItem icon={<FaRegKeyboard />} title="Hotkey" link="/hotkey" index={4} />
            <SideBarItem icon={<FiTool />} title="Debug" link="/debug" index={5} />
          </SideBarProvider>
        </VStack>
      </Flex>
    </>
  );
};
