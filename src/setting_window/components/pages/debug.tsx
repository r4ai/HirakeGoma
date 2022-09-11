import { FC, useState } from "react";
import { SettingItem } from "../parts/SettingItem";
import { SettingHeading } from "../parts/SettingHeading";
import { Collapse, Button, IconButton, Box, Heading, Text, Divider, useDisclosure } from "@chakra-ui/react";
import { invoke } from "@tauri-apps/api";
import Editor from "@monaco-editor/react";
import { FiChevronUp, FiChevronDown } from "react-icons/fi";

export const Debug: FC = () => {
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
        <Button colorScheme="red" variant="outline" size="sm" h={6}>
          Run
        </Button>
      </SettingItem>
    </>
  );
};
