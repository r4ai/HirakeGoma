import {
  Collapse,
  Button,
  IconButton,
  Box,
  Stack,
  Input,
  useDisclosure,
  useToast,
  useColorMode,
  HStack
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

  //* --- SEARCH
  const { isOpen: isOpenSearchResults, onToggle: onToggleSearchResults } = useDisclosure();
  const [result, setResult] = useState(""); // TODO: SearchDatabaseの型
  const [keyword, setKeyword] = useState("");
  function search(keyword: string): void {
    const minScore = 10;
    const res = invoke("search", { keyword, minScore }).then((items) => {
      console.log(items);
      setResult(JSON.stringify(items, null, "\t"));
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

      <SettingItem title="SEARCH" description="Search given keyword.">
        <Input
          value={keyword}
          size="sm"
          placeholder=""
          onChange={(e) => {
            setKeyword(e.target.value);
            search(keyword);
          }}
        />
        <HStack>
          <Button
            colorScheme="red"
            variant="outline"
            size="sm"
            w="-webkit-fit-content"
            h={6}
            onClick={() => {
              search(keyword);
            }}
          >
            Search
          </Button>
          <IconButton
            aria-label="collapse search results"
            icon={isOpenSearchResults ? <FiChevronUp /> : <FiChevronDown />}
            colorScheme="orange"
            size="sm"
            variant="outline"
            ml={2}
            w="-webkit-fit-content"
            h={6}
            onClick={() => {
              onToggleSearchResults();
            }}
          />
        </HStack>
        <Collapse in={isOpenSearchResults} animateOpacity>
          <Editor
            css={{ marginBottom: "4px" }}
            height="70vh"
            value={result}
            defaultLanguage="json"
            defaultValue=""
            theme="vs-dark"
          />
        </Collapse>
      </SettingItem>

      <SettingHeading title="Theme" />

      <SettingItem title="COLOR MODE" description="Toggle between dark and light modes.">
        <Button colorScheme="red" variant="outline" size="sm" h={6} onClick={toggleColorMode}>
          Toggle {colorMode === "light" ? "dark" : "light"}
        </Button>
      </SettingItem>

      <SettingItem title="TOGGLE SIDEBAR" description="Toggle sideBar width between small and large. TODO:">
        <Button colorScheme="red" variant="outline" size="sm" h={6} onClick={() => {}}>
          Toggle width(currently, this is FAKE button)
        </Button>
      </SettingItem>
    </>
  );
};
