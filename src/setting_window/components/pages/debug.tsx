import { FC, useState } from "react";
import { SettingItem } from "../parts/SettingItem";
import { SettingHeading } from "../parts/SettingHeading";
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
  useDisclosure
} from "@chakra-ui/react";
import { invoke } from "@tauri-apps/api";
import Editor from "@monaco-editor/react";
import { FiChevronUp, FiChevronDown } from "react-icons/fi";
import { message } from "@tauri-apps/api/dialog";

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
    console.log(printDatabaseValue);
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
        <Box m>
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
        <Text>TODO</Text>
        <Button colorScheme="red" variant="outline" size="sm" h={6} onClick={handleInsertDatabase}>
          Run
        </Button>
      </SettingItem>
    </>
  );
};
