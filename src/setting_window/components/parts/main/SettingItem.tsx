import { Stack, Heading, Text } from "@chakra-ui/react";
import { FC, ReactNode } from "react";

import { SettingItemBase } from "./SettingItemBase";

interface Props {
  children: ReactNode;
  title: string;
  description: string;
}

export const SettingItem: FC<Props> = ({ children, title, description }) => {
  return (
    <SettingItemBase>
      <Heading as="h2" size="md">
        {title}
      </Heading>
      <Text>{description}</Text>
      <Stack my={2} spacing={2}>
        {children}
      </Stack>
    </SettingItemBase>
  );
};
