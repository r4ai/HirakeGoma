import { HStack, Flex, Breadcrumb, BreadcrumbItem, BreadcrumbLink } from "@chakra-ui/react";
import { appWindow } from "@tauri-apps/api/window";
import { FC, useEffect, useState } from "react";
import { FiX, FiMaximize, FiMinimize, FiMinus } from "react-icons/fi";
import { SystemIconButtons } from "../parts/title";

import { SystemIconButton } from "../parts/title/SystemIconButton";

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
        <SystemIconButtons />
      </Flex>
    </>
  );
};
