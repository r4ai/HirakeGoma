import { HStack, Flex, Box, IconButton, Breadcrumb, BreadcrumbItem, BreadcrumbLink } from "@chakra-ui/react";
import { appWindow } from "@tauri-apps/api/window";
import { FC } from "react";
import { FiX, FiMaximize, FiMinus } from "react-icons/fi";

import { SystemIconButton } from "../parts/SystemIconButton";

export const TitleBar: FC = () => {
  return (
    <>
      <Flex data-tauri-drag-region justifyContent="space-between" h="100%" userSelect="none">
        <Breadcrumb alignSelf="center" ml={5}>
          <BreadcrumbItem>
            <BreadcrumbLink href="#">Debug</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbItem>
            <BreadcrumbLink href="#">Database</BreadcrumbLink>
          </BreadcrumbItem>
        </Breadcrumb>
        <HStack alignSelf="start" spacing={0}>
          <SystemIconButton aria-label="minimize" icon={<FiMinus />} />
          <SystemIconButton aria-label="minimize" icon={<FiMaximize />} />
          <SystemIconButton aria-label="minimize" icon={<FiX />} />
        </HStack>
      </Flex>
    </>
  );
};
