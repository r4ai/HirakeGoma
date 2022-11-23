import { HStack } from "@chakra-ui/react";
import { appWindow } from "@tauri-apps/api/window";
import { FC, useEffect, useState } from "react";
import { FiMaximize, FiMinimize, FiMinus, FiX } from "react-icons/fi";
import { SystemIconButton } from "./SystemIconButton";

export const SystemIconButtons: FC = () => {
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
    // * HANDLE APP_WINDOW SIZE CHANGE EVENT
    const unlistenPromise = appWindow.onResized(async ({ payload: size }) => {
      await toggleMaximizeIcon();
      console.log("CHANGED!!");
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

  useEffect(() => {}, []);

  return (
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
  );
};
