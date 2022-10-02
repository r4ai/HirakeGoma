import { IconButton, Input, InputGroup, InputRightElement, Spacer, VStack, Heading } from "@chakra-ui/react";
import { open } from "@tauri-apps/api/dialog";
import { FC, useEffect, useState } from "react";
import { FiFolderPlus } from "react-icons/fi";
import { v4 } from "uuid";

import { get } from "../../../../../commands/plugin/appsearch/get";
import { updateFolderPath } from "../../../../../commands/plugin/appsearch/updateFolderPath";
import { SettingItem, SettingListItem } from "../../../parts/main";

interface FolderPathsType {
  FolderPaths: string[];
}
let isInitializing = false;

export const FolderPaths: FC = () => {
  const [inputValue, setInputValue] = useState("");
  const [folderPaths, setFolderPaths] = useState<string[]>([]);

  useEffect(() => {
    // * PULL DATA FROM BACKEND ON STARTUP
    isInitializing = true;
    console.log("PULL: table=PluginAppsearchTable key=folder_paths");
    void get<FolderPathsType>("folder_paths")
      .then((res) => {
        setFolderPaths(res.FolderPaths);
      })
      .then(() => {
        isInitializing = false;
      })
      .catch((e) => {
        console.error(e);
        isInitializing = false;
      });
  }, []);

  useEffect(() => {
    // * PUSH DATA TO BACKEND ON CHANGE
    if (!isInitializing) {
      console.log("PUSH: table=PluginAppsearchTable key=folder_paths");
      void updateFolderPath(folderPaths).catch(console.error);
    }
  }, [folderPaths]);

  function openDialog(): void {
    void open().then((files) => console.log(files));
  }

  function handleRemove(index: number): void {
    const tmp = [...folderPaths];
    tmp.splice(index, 1);
    setFolderPaths(tmp);
  }

  return (
    <SettingItem title="Folder Paths" description="Edit Folder paths to search applications.">
      <VStack>
        <Heading as="h3" size="sm" alignSelf="flex-start">
          Add
        </Heading>
        <InputGroup>
          <Input
            placeholder="Enter folder path to search applications."
            value={inputValue}
            onChange={(e) => {
              setInputValue(e.target.value);
            }}
            onKeyUp={(e) => {
              if (e.key === "Enter") {
                setFolderPaths([inputValue, ...folderPaths]);
                setInputValue("");
              }
            }}
          />
          <InputRightElement>
            <IconButton
              aria-label="Create"
              icon={<FiFolderPlus />}
              onClick={() => {
                openDialog();
              }}
            />
          </InputRightElement>
        </InputGroup>
        <Spacer />
        <Heading as="h3" size="sm" alignSelf="flex-start">
          List of enabled paths
        </Heading>
        {folderPaths.map((path, i) => (
          <SettingListItem
            value={path}
            key={v4()}
            onRemoveIconClick={() => {
              handleRemove(i);
            }}
            onEditIconClick={() => {}}
          />
        ))}
      </VStack>
    </SettingItem>
  );
};
