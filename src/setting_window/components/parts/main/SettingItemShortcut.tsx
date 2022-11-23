import {
  Button,
  Input,
  Text,
  Kbd,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
  ModalFooter
} from "@chakra-ui/react";
import { css } from "@emotion/react";
import { EmotionJSX } from "@emotion/react/types/jsx-namespace";
import { FC, useRef, useState, KeyboardEvent, useEffect } from "react";
import { coreOsGetName } from "../../../../commands/core";
import { settingHotkeyChange } from "../../../../commands/setting/settingHotkeyChange";
import { settingHotkeyGet } from "../../../../commands/setting/settingHotkeyGet";
import { settingHotkeyUpdate } from "../../../../commands/setting/settingHotkeyUpdate";
import { Hotkeys } from "../../../../types/Hotkey";
import { SettingCardItem } from "./cards/SettingCardItem";

interface Props {
  title: string;
  shortcut: keyof Hotkeys;
}

type Kbd = EmotionJSX.Element;

export const SettingItemShortcut: FC<Props> = ({ title, shortcut }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const finalRef = useRef(null);
  const [keyCodes, setKeyCodes] = useState<string[]>([]);
  const [osname, setOsname] = useState("windows");
  const [currentKeyCode, setCurrentKeyCode] = useState("undefined");
  const [currentKbd, setCurrentKbd] = useState<Kbd[]>([<Text>undefined</Text>]);

  function handleKeyPress(e: KeyboardEvent<HTMLInputElement>) {
    console.log(e.key);
    switch (e.key) {
      case "Escape":
        return;
      default:
        setKeyCodes((prev) => [...prev, e.key]);
        return;
    }
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
    await setCurrentKeyCode(keyCode);
  }

  useEffect(() => {
    // * GET OS NAME
    coreOsGetName().then((res) => setOsname(res));
  }, []);

  useEffect(() => {
    // * GET CURRENT HOTKEY FROM SETTING DB
    settingHotkeyGet(shortcut)
      .then((value) => {
        if (value === null) {
          setCurrentKeyCode("undefined");
        } else {
          setCurrentKeyCode(value);
        }
      })
      .catch((e) => setCurrentKeyCode("undefined"));
    console.log(currentKeyCode.replaceAll("+", ",+,").split(","));
  }, []);

  useEffect(() => {
    // * FORMAT GOT CURRENT HOTKEY STRING INTO REACT COMPONENT
    const res = currentKeyCode
      .replaceAll("+", ",+,")
      .split(",")
      .map((value, i) => {
        switch (value) {
          case "undefined":
            return <Kbd>undefined</Kbd>;
          case "+":
            return <Text>+</Text>;
          case "CommandOrControl":
            if (osname === "macos") {
              return <Kbd>Cmd</Kbd>;
            } else {
              return <Kbd>Ctrl</Kbd>;
            }
          default:
            return <Kbd>{value}</Kbd>;
        }
      });
    setCurrentKbd(res);
  }, [currentKeyCode]);

  return (
    <>
      <SettingCardItem title={title} ref={finalRef} tabIndex={-1}>
        <Button variant="link" onClick={onOpen}>
          {currentKbd}
        </Button>
      </SettingCardItem>

      <Modal finalFocusRef={finalRef} isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader textAlign="center">Please press keys...</ModalHeader>
          <ModalBody>
            <Input
              variant="unstyled"
              onKeyDown={(e) => handleKeyPress(e)}
              w={0}
              bgColor="red"
              css={css`
                caret-color: rgba(0, 0, 0, 0);
              `}
            />
          </ModalBody>
          <ModalFooter>
            <Button mr={3} onClick={onClose}>
              CANCEL
            </Button>
            <Button
              colorScheme="red"
              variant="solid"
              onClick={() => {
                applyHotkey(shortcut, generateKeyCode());
                onClose();
              }}
            >
              APPLY
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
