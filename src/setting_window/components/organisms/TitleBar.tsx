import { HStack, Flex, Breadcrumb, BreadcrumbItem, BreadcrumbLink } from "@chakra-ui/react";
import { appWindow } from "@tauri-apps/api/window";
import { FC, useEffect, useState } from "react";
import { FiX, FiMaximize, FiMinimize, FiMinus } from "react-icons/fi";

import { SystemIconButton } from "../parts/SystemIconButton";

export const TitleBar: FC = () => {
  const [maximizeIcon, setMaximizeIcon] = useState(<FiMaximize />);
  async function toggleMaximizeIcon(): Promise<void> {
    await appWindow.isMaximized().then((isMaximized) => {
      if (isMaximized) {
        setMaximizeIcon(<FiMinimize />);
      } else {
        setMaximizeIcon(<FiMaximize />);
      }
    });
  }
  async function handleToggleMaximize(): Promise<void> {
    await appWindow.toggleMaximize();
    await toggleMaximizeIcon();
  }

  useEffect(() => {
    const unlistenPromise = appWindow.onResized(async ({ payload: size }) => {
      await toggleMaximizeIcon();
      // console.log(size);
    });
    return () => {
      async function unlisten(): Promise<void> {
        await unlistenPromise.then((fn) => {
          fn();
        });
      }
      void unlisten();
    };
  }, []);

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
          <SystemIconButton
            aria-label="minimize"
            icon={<FiMinus />}
            onClick={async () => {
              await appWindow.minimize();
            }}
          />
          <SystemIconButton aria-label="maximize" icon={maximizeIcon} onClick={handleToggleMaximize} />
          <SystemIconButton
            aria-label="close"
            icon={<FiX />}
            onClick={async () => {
              await appWindow.close();
            }}
          />
        </HStack>
      </Flex>
    </>
  );
};
