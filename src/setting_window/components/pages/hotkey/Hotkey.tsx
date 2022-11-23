import { Card, CardBody, CardHeader, Heading, Spacer, Stack, StackDivider } from "@chakra-ui/react";
import { FC } from "react";
import { SettingHeading, SettingItemShortcut } from "../../parts/main";
import { SettingCard } from "../../parts/main/cards/SettingCard";
import { OpenMainWindow } from "./window/OpenMainWindow";
import { OpenSettingWindow } from "./window/OpenSettingWindow";

export const Hotkey: FC = () => {
  return (
    <>
      <Heading as="h1" size="lg" marginBottom={6}>
        HotKey
      </Heading>
      <Spacer />
      <Stack spacing={4}>
        <SettingCard>
          <CardHeader>
            <Heading size="md">Window</Heading>
          </CardHeader>
          <CardBody>
            <Stack divider={<StackDivider />} spacing="1">
              <SettingItemShortcut title="Open Search Window" shortcut="open_main_window" />
              <SettingItemShortcut title="Open Setting Window" shortcut="open_setting_window" />
            </Stack>
          </CardBody>
        </SettingCard>
        <SettingCard>
          <CardHeader>
            <Heading size="md">Debug</Heading>
          </CardHeader>
          <CardBody>
            <Stack divider={<StackDivider />} spacing="1"></Stack>
          </CardBody>
        </SettingCard>
      </Stack>
    </>
  );
};
