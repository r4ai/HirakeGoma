import { useToast } from "@chakra-ui/react";
import { FC, useState } from "react";

import { generateIndex } from "../../../../../commands/plugin/appsearch/generateIndex";
import { uploadToMainTable } from "../../../../../commands/plugin/appsearch/uploadToMaintable";
import { SettingItem, SettingItemButton } from "../../../parts/main";

export const Generate: FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const errorToast = useToast();

  async function handleClick(): Promise<void> {
    setIsLoading(true);
    generateIndex(false)
      .then((s) => {
        uploadToMainTable()
          .then((s) => {
            setIsLoading(false);
          })
          .catch((e) => {
            errorToast({
              title: "ERROR: Failed to upload to `MainTable` from `ApplicationTable`.",
              description: e,
              position: "top",
              status: "error",
              isClosable: true,
              duration: 5000
            });
          });
      })
      .catch((e) => {
        errorToast({
          title: "ERROR: Failed to generate indexes in `ApplicationTable`.",
          description: e,
          position: "top",
          status: "error",
          isClosable: true,
          duration: 5000
        });
        setIsLoading(false);
      });
  }

  return (
    <>
      <SettingItem title="Generate" description="Generate index in application table.">
        {isLoading ? (
          <SettingItemButton isLoading loadingText="Generating" onClick={handleClick}>
            Generate
          </SettingItemButton>
        ) : (
          <SettingItemButton onClick={handleClick}>Generate</SettingItemButton>
        )}
      </SettingItem>
    </>
  );
};
