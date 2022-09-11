import { FC, ReactNode } from "react";
import { Box, Heading, Text } from "@chakra-ui/react";
import { SettingItemBase } from "./SettingItemBase";

interface Props {
  children: ReactNode;
  title: string;
  description: string;
}

export const SettingItem: FC<Props> = ({ children, title, description }) => {
  return (
    <SettingItemBase>
      <Heading as="h2" size="sm">
        {title}
      </Heading>
      <Text>{description}</Text>
      <Box>{children}</Box>
    </SettingItemBase>
  );
};
