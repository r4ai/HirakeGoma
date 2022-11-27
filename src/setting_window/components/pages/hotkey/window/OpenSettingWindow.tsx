import {
  Button,
  Input,
  Kbd,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  useDisclosure
} from "@chakra-ui/react";
import { FC, KeyboardEvent, useRef, useState } from "react";
import { settingHotkeyChange } from "../../../../../commands/setting/settingHotkeyChange";
import { settingHotkeyUpdate } from "../../../../../commands/setting/settingHotkeyUpdate";
import { SettingCardItem } from "../../../parts/main/cards/SettingCardItem";

export const OpenSettingWindow: FC = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const finalRef = useRef(null);
  const [keyCodes, setKeyCodes] = useState<string[]>([]);

  function handleKeyPress(e: KeyboardEvent<HTMLInputElement>) {
    console.log(e.key);
    setKeyCodes((prev) => [...prev, e.key]);
  }

  function generateKeyCode(): string {
    const keyCode = keyCodes.reduce((pre, current) => {
      switch (current) {
        case "Control":
          current = "CommandOrControl";
          break;

        default:
          break;
      }
      return `${pre}+${current}`;
    });
    console.log(keyCode);
    setKeyCodes([]);
    return keyCode;
  }

  async function applyHotkey(shortcut: string, keyCode: string) {
    await settingHotkeyChange(shortcut, keyCode);
    await settingHotkeyUpdate(); // register all shortcuts in setting_db
  }

  return (
    <>
      <SettingCardItem title={"Open Setting Window"} ref={finalRef} tabIndex={-1}>
        <Button variant="link" onClick={onOpen}>
          <Kbd>undefined</Kbd>
        </Button>
      </SettingCardItem>

      <Modal
        finalFocusRef={finalRef}
        isOpen={isOpen}
        onClose={() => {
          onClose();
          applyHotkey("open_setting_window", generateKeyCode());
        }}
        isCentered
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader textAlign="center">Please press keys...</ModalHeader>
          <ModalBody>
            <Input variant="unstyled" onKeyDown={(e) => handleKeyPress(e)} />
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};
