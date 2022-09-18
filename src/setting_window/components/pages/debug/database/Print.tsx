import { Collapse, HStack, useDisclosure } from "@chakra-ui/react";
import Editor from "@monaco-editor/react";
import { invoke } from "@tauri-apps/api";
import { FC, useState } from "react";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";

import { SettingItem, SettingItemButton, SettingItemIconButton } from "../../../parts/main";

export const Print: FC = () => {
  const { isOpen: isOpenPrintConsole, onToggle: onTogglePrintConsole } = useDisclosure();
  const [printDatabaseValue, setPrintDatabaseValue] = useState("");

  function handlePrintDatabase(): void {
    setPrintDatabaseValue("");
    if (!isOpenPrintConsole) {
      onTogglePrintConsole();
    }
    void invoke("get_all_search_database_items").then((items) =>
      setPrintDatabaseValue(JSON.stringify(items, null, "\t"))
    );
  }

  return (
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
  );
};
