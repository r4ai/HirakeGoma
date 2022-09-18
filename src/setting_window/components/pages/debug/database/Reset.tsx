import { useToast } from "@chakra-ui/react";
import { invoke } from "@tauri-apps/api";
import { FC } from "react";

import { SettingItem, SettingItemButton } from "../../../parts/main";

export const Reset: FC = () => {
  const clearDatabaseToast = useToast();

  function handleResetDatabase(): void {
    void invoke<string>("clear_search_database").then((msg) => {
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

  return (
    <SettingItem title="RESET" description="Remove all items in search_database.">
      <SettingItemButton onClick={handleResetDatabase}>Clear DB</SettingItemButton>
    </SettingItem>
  );
};
