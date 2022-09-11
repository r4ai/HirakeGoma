import { FC } from "react";
import { SettingItem } from "../parts/SettingItem";
import { SettingHeading } from "../parts/SettingHeading";
import { Collapse, Button, Box, Heading, Text, Divider, useDisclosure } from "@chakra-ui/react";
import { invoke } from "@tauri-apps/api";
import Editor from "@monaco-editor/react";

export const Debug: FC = () => {
  const { isOpen: isOpenPrintConsole, onToggle: onTogglePrintConsole } = useDisclosure();
  return (
    <>
      <SettingHeading title="Database" />

      <SettingItem title="PRINT" description="Print all items in search_database.">
        <Collapse in={isOpenPrintConsole} animateOpacity>
          <Box>
            Anim pariatur cliche reprehenderit, enim eiusmod high life accusamus terry richardson ad squid. Nihil anim
            keffiyeh helvetica, craft beer labore wes anderson cred nesciunt sapiente ea proident.
          </Box>
        </Collapse>
        <Button
          colorScheme="red"
          variant="outline"
          size="sm"
          h={6}
          onClick={() => {
            onTogglePrintConsole();
            // invoke("dbg_search_database_items");
          }}
        >
          Run
        </Button>
      </SettingItem>

      <SettingItem title="INSERT" description="Insert an application item to the search_database manually.">
        <Button colorScheme="red" variant="outline" size="sm" h={6}>
          Run
        </Button>
      </SettingItem>
    </>
  );
};
