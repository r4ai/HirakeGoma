import { Collapse, HStack, Input, Textarea, useDisclosure } from "@chakra-ui/react";
import Editor from "@monaco-editor/react";
import { invoke } from "@tauri-apps/api";
import { exit } from "@tauri-apps/api/process";
import { FC, useEffect, useState } from "react";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";

import { SettingItem, SettingItemButton, SettingItemIconButton } from "../../../parts/main";

export const Invoke: FC = () => {
  const { isOpen, onToggle } = useDisclosure();
  const [commandName, setCommandName] = useState("");
  const [rawArgs, setRawArgs] = useState("");
  const [result, setResult] = useState("");

  async function invokeCmd(): Promise<void> {
    let res;
    if (rawArgs.length === 0) {
      res = await invoke(commandName);
    } else {
      res = await invoke(commandName, JSON.parse(rawArgs));
    }
    onToggle();
    setResult(JSON.stringify(res, null, "\t"));
  }

  return (
    <SettingItem title="INVOKE" description="Invoke Command">
      <Input
        placeholder="Command name"
        value={commandName}
        onChange={(e) => {
          setCommandName(e.target.value);
        }}
      />
      {/* <Textarea placeholder="Command args" value={rawArgs} onChange={(e) => setRawArgs(e.target.value)} /> */}
      <Editor
        css={{ marginBottom: "4px" }}
        height="150px"
        value={rawArgs}
        onChange={(v) => {
          v ? setRawArgs(v) : setRawArgs("");
        }}
        defaultLanguage="json"
        defaultValue=""
        theme="vs-dark"
      />
      <HStack>
        <SettingItemButton
          onClick={() => {
            void invokeCmd();
          }}
        >
          Invoke
        </SettingItemButton>
        <SettingItemIconButton
          aria-label="collapse console"
          icon={isOpen ? <FiChevronUp /> : <FiChevronDown />}
          onClick={() => {
            onToggle();
          }}
        />
      </HStack>
      <Collapse in={isOpen} animateOpacity>
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
