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

import { SettingHeading } from "../parts/main/SettingHeading";
import { SettingItem } from "../parts/main/SettingItem";
import { SettingItemButton } from "../parts/main/SettingItemButton";
import { SettingItemIconButton } from "../parts/main/SettingItemIconButton";

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
      setResult(JSON.stringify(items, null, "\t"));
    });
  }
  function handleInputBoxChange(targetValue: string): void {
    if (!isOpenSearchResults) {
      onToggleSearchResults();
    }
    setKeyword(targetValue);
    search(targetValue);
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
        <HStack>
          <SettingItemButton
            onClick={() => {
              handlePrintDatabase();
            }}
          >
            Run
          </SettingItemButton>
          <SettingItemIconButton
            aria-label="collapse console"
            icon={isOpenPrintConsole ? <FiChevronUp /> : <FiChevronDown />}
            onClick={() => {
              onTogglePrintConsole();
            }}
          />
        </HStack>
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
        <SettingItemButton onClick={handleInsertDatabase}>Insert</SettingItemButton>
      </SettingItem>

      <SettingItem title="RESET" description="Remove all items in search_database.">
        <SettingItemButton onClick={handleResetDatabase}>Clear DB</SettingItemButton>
      </SettingItem>

      <SettingItem title="SEARCH" description="Search given keyword.">
        <Input
          value={keyword}
          size="sm"
          placeholder=""
          onChange={(e) => {
            handleInputBoxChange(e.target.value);
          }}
        />
        <HStack>
          <SettingItemButton
            onClick={() => {
              search(keyword);
            }}
          >
            Search
          </SettingItemButton>
          <SettingItemIconButton
            aria-label="collapse search results"
            icon={isOpenSearchResults ? <FiChevronUp /> : <FiChevronDown />}
            onClick={onToggleSearchResults}
            colorScheme="orange"
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
        <SettingItemButton onClick={toggleColorMode}>
          Toggle {colorMode === "light" ? "dark" : "light"}
        </SettingItemButton>
      </SettingItem>

      <SettingItem title="TOGGLE SIDEBAR" description="Toggle sideBar width between small and large. TODO:">
        <SettingItemButton onClick={() => {}}>Toggle width(currently, this is FAKE button)</SettingItemButton>
      </SettingItem>
    </>
  );
};
