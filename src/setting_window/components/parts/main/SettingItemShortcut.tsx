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
  ModalFooter,
  Grid,
  GridItem,
  Box,
  Stack,
  HStack,
  Container
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
  const [osName, setOsName] = useState("windows");

  const [keyCodes, setKeyCodes] = useState<string[]>([]);
  const [stringKeyCodes, setStringKeyCodes] = useState("");
  const [componentKeyCodes, setComponentKeyCodes] = useState<Kbd[]>([]);

  const [currentKeyCode, setCurrentKeyCode] = useState("undefined");
  const [currentKbd, setCurrentKbd] = useState<Kbd[]>([<Text>undefined</Text>]);

  function handleOpen() {
    setKeyCodes([]);
    onOpen();
  }

  function handleClose() {
    onClose();
    setKeyCodes([]);
  }

  function handleKeyPress(e: KeyboardEvent<HTMLInputElement>) {
    console.log(`raw_input: ${e.key}`);
    switch (e.key) {
      case "Escape":
        return;
      default:
        setKeyCodes((prev) => [...prev, e.key]);
        return;
    }
  }

  function formatKeyCode(KeyCodeList: string[]): string {
    const keyCode = KeyCodeList.reduce((pre, current) => {
      switch (current) {
        case "Control":
          current = "CommandOrControl";
          break;
        case "Meta":
          current = "CommandOrControl";
          break;
        case " ":
          current = "Space";
        default:
          break;
      }
      return `${pre}+${current}`;
    });
    console.log(`keycode: ${keyCode}`);
    return keyCode;
  }

  function generateKbdComponent(formattedKeyCode: string): Kbd[] {
    const res = formattedKeyCode
      .replaceAll("+", ",+,")
      .split(",")
      .map((value) => {
        switch (value) {
          case "undefined":
            return <Kbd>undefined</Kbd>;
          case "+":
            return <Text>+</Text>;
          case "CommandOrControl":
            if (osName === "macos") {
              return <Kbd>Cmd</Kbd>;
            } else {
              return <Kbd>Ctrl</Kbd>;
            }
          default:
            return <Kbd>{value}</Kbd>;
        }
      });
    console.log(res);
    return res;
  }

  async function applyHotkey(shortcut: string, formattedKeyCode: string) {
    await settingHotkeyChange(shortcut, formattedKeyCode);
    await settingHotkeyUpdate(); // register all shortcuts in setting_db
    await setCurrentKeyCode(formattedKeyCode);
  }

  async function onDelete() {}

  useEffect(() => {
    // * GET OS NAME
    coreOsGetName().then((res) => setOsName(res));
  }, []);

  useEffect(() => {
    // * FORMAT KEYCODE LIST INTO STRING & KBD COMPONENTS
    if (keyCodes.length === 0) {
      setStringKeyCodes("");
    } else {
      setStringKeyCodes(formatKeyCode(keyCodes));
    }
  }, [keyCodes]);

  useEffect(() => {
    if (stringKeyCodes === "") {
      setComponentKeyCodes([]);
    } else {
      setComponentKeyCodes(generateKbdComponent(stringKeyCodes));
    }
  }, [stringKeyCodes]);

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
      .catch((_) => setCurrentKeyCode("undefined"));
    console.log(currentKeyCode.replaceAll("+", ",+,").split(","));
  }, []);

  useEffect(() => {
    // * FORMAT GOT CURRENT HOTKEY STRING INTO REACT COMPONENT
    setCurrentKbd(generateKbdComponent(currentKeyCode));
  }, [currentKeyCode]);

  return (
    <>
      <SettingCardItem title={title} ref={finalRef} tabIndex={-1}>
        <Button variant="link" onClick={handleOpen}>
          {currentKbd}
        </Button>
      </SettingCardItem>

      <Modal finalFocusRef={finalRef} isOpen={isOpen} onClose={handleClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader textAlign="center">Please press keys...</ModalHeader>
          <ModalBody>
            <Grid templateColumns="1fr auto 1fr">
              <HStack gridColumn="2 / 3" justifySelf="center">
                {componentKeyCodes}
              </HStack>
            </Grid>
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
            <Grid templateColumns="auto 1fr auto" w="100%">
              <GridItem gridColumn="1 / 2" justifySelf="flex-start">
                <Button colorScheme="red" variant="solid" onClick={onDelete}>
                  DELETE
                </Button>
              </GridItem>
              <GridItem gridColumn="3 / 4">
                <Button mr={3} onClick={onClose}>
                  CANCEL
                </Button>
                <Button
                  colorScheme="red"
                  variant="solid"
                  onClick={() => {
                    // applyHotkey(shortcut, formatKeyCode());
                    handleClose();
                  }}
                >
                  APPLY
                </Button>
              </GridItem>
            </Grid>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
