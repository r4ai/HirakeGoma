import { Button, Input, Kbd } from "@chakra-ui/react";
import { FC } from "react";
import { SettingItemH } from "../../../parts/main";
import { SettingCardItem } from "../../../parts/main/cards/SettingCardItem";

function handleSubmit() {}

export const OpenMainWindow: FC = () => {
  return (
    <>
      <SettingCardItem title={"Open Search Window"}>
        <Button variant="link">
          <Kbd>Ctrl</Kbd> + <Kbd>Space</Kbd>
        </Button>
      </SettingCardItem>
    </>
  );
};
