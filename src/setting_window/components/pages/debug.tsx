import {
  Collapse,
  Button,
  IconButton,
  Box,
  Stack,
  Input,
  FormErrorMessage,
  Heading,
  Text,
  Divider,
  useDisclosure,
  useToast,
  useColorMode
} from "@chakra-ui/react";
import Editor from "@monaco-editor/react";
import { invoke } from "@tauri-apps/api";
import { message } from "@tauri-apps/api/dialog";
import { FC, useState } from "react";
import { FiChevronUp, FiChevronDown } from "react-icons/fi";

import { SettingHeading } from "../parts/SettingHeading";
import { SettingItem } from "../parts/SettingItem";

export const Debug: FC = () => {
  //* --- PRINT
  const { isOpen: isOpenPrintConsole, onToggle: onTogglePrintConsole } = useDisclosure();
  const [printDatabaseValue, setPrintDatabaseValue] = useState("");

  function handlePrintDatabase(): void {
    setPrintDatabaseValue("");
    if (!isOpenPrintConsole) {
      onTogglePrintConsole();
    }
    const res = invoke("get_all_search_database_items").then((items) =>
      setPrintDatabaseValue(JSON.stringify(items, null, "\t"))
    );
  }

  //* --- INSERT
  const [appTitle, setAppName] = useState("");
  const [appPath, setAppPath] = useState("");
  const [appIconPath, setAppIconPath] = useState("");

  function handleInsertDatabase(): void {
    console.log(appTitle);
    console.log(appPath);
    console.log(appIconPath);
    const res = invoke("add_app_to_search_database", {
      appTitle,
      appIconPath,
      appPath
    })
      .then((message) => {
        console.log("Succeeded");
      })
      .catch((message) => {
        console.log("ERROR");
        console.log(message);
      });
    setAppName("");
    setAppPath("");
    setAppIconPath("");
  }

  //* --- RESET
  const clearDatabaseToast = useToast();
  function handleResetDatabase(): void {
    const res = invoke<string>("clear_search_database").then((msg) => {
      switch (msg) {
        case "SUCCESS":
          clearDatabaseToast({
            title: "Search database cleared",
            description: "All database items has been removed successfully.",
            position: "top",
            status: "success",
            isClosable: true,
            duration: 5000
          });
          break;
        case "ERROR":
          clearDatabaseToast({
            title: "ERROR",
            description: "Couldn't clear the database.",
            position: "top",
            status: "error",
            isClosable: true,
            duration: 5000
          });
          break;
      }
    });
  }

  //* --- COLOR_MODE
  const { colorMode, toggleColorMode } = useColorMode();

  return (
    <>
      <SettingHeading title="Database" />

      <SettingItem title="PRINT" description="Print all items in search_database.">
        <Collapse in={isOpenPrintConsole} animateOpacity>
          <Editor
            css={{ marginBottom: "4px" }}
            height="70vh"
            value={printDatabaseValue}
            defaultLanguage="json"
            defaultValue=""
            theme="vs-dark"
          />
        </Collapse>
        <Box>
          <Button
            colorScheme="red"
            variant="outline"
            size="sm"
            h={6}
            onClick={() => {
              handlePrintDatabase();
            }}
          >
            Run
          </Button>
          <IconButton
            aria-label="collapse console"
            icon={isOpenPrintConsole ? <FiChevronUp /> : <FiChevronDown />}
            colorScheme="orange"
            size="sm"
            variant="outline"
            ml={2}
            h={6}
            onClick={() => {
              onTogglePrintConsole();
            }}
          />
        </Box>
      </SettingItem>

      <SettingItem title="INSERT" description="Insert an application item to the search_database manually.">
        <Stack my={2} spacing={2}>
          <Input
            value={appTitle}
            size="sm"
            placeholder="Application Name"
            onChange={(e) => {
              setAppName(e.target.value);
            }}
          ></Input>
          <Input
            value={appPath}
            size="sm"
            placeholder="Application File Path"
            onChange={(e) => {
              setAppPath(e.target.value);
            }}
          ></Input>
          <Input
            value={appIconPath}
            size="sm"
            placeholder="Application Icon Path"
            onChange={(e) => {
              setAppIconPath(e.target.value);
            }}
          ></Input>
        </Stack>
        <Button colorScheme="red" variant="outline" size="sm" h={6} onClick={handleInsertDatabase}>
          Insert
        </Button>
      </SettingItem>

      <SettingItem title="RESET" description="Remove all items in search_database.">
        <Button colorScheme="red" variant="outline" size="sm" h={6} onClick={handleResetDatabase}>
          Clear DB
        </Button>
      </SettingItem>

      <SettingHeading title="Theme" />

      <SettingItem title="COLOR MODE" description="Toggle between dark and light modes.">
        <Button colorScheme="red" variant="outline" size="sm" h={6} onClick={toggleColorMode}>
          Toggle {colorMode === "light" ? "dark" : "light"}
        </Button>
      </SettingItem>
    </>
  );
};
