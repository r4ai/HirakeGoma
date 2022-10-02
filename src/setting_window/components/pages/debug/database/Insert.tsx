import { Input, Stack } from "@chakra-ui/react";
import { invoke } from "@tauri-apps/api";
import { FC, useState } from "react";

import { SettingItem, SettingItemButton } from "../../../parts/main";

export const Insert: FC = () => {
  const [appTitle, setAppName] = useState("");
  const [appPath, setAppPath] = useState("");
  const [appIconPath, setAppIconPath] = useState("");

  function handleInsertDatabase(): void {
    console.log(appTitle);
    console.log(appPath);
    console.log(appIconPath);
    void invoke("add_app_to_search_database", {
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
  );
};
