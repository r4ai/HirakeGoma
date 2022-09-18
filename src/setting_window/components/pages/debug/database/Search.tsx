import { Collapse, HStack, Input, useDisclosure } from "@chakra-ui/react";
import Editor from "@monaco-editor/react";
import { invoke } from "@tauri-apps/api";
import { FC, useState } from "react";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";

import { SettingItem, SettingItemButton, SettingItemIconButton } from "../../../parts/main";

export const Search: FC = () => {
  const { isOpen: isOpenSearchResults, onToggle: onToggleSearchResults } = useDisclosure();
  const [result, setResult] = useState(""); // TODO: SearchDatabaseの型
  const [keyword, setKeyword] = useState("");
  function search(keyword: string): void {
    const minScore = 10;
    void invoke("search", { keyword, minScore }).then((items) => {
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

  return (
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
  );
};
