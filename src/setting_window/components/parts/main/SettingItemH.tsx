import { Stack, Heading, Text, Grid, GridItem } from "@chakra-ui/react";
import { FC, ReactNode } from "react";

import { SettingItemBase } from "./SettingItemBase";

interface Props {
  children: ReactNode;
  title: string;
  description: string;
}

export const SettingItemH: FC<Props> = ({ children, title, description }) => {
  return (
    <SettingItemBase>
      <Grid templateColumns="auto 1fr auto">
        <GridItem colStart={1} colEnd={2}>
          <Heading as="h2" size="md">
            {title}
          </Heading>
          <Text marginTop={2}>{description}</Text>
        </GridItem>
        <GridItem colStart={3} colEnd={4}>
          <Stack my={2} spacing={2}>
            {children}
          </Stack>
        </GridItem>
      </Grid>
    </SettingItemBase>
  );
};
