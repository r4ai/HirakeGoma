import { forwardRef, Grid, GridItem, GridProps, Heading, Stack, Text } from "@chakra-ui/react";
import { T } from "@tauri-apps/api/event-2a9960e7";
import { FC, ReactNode, Ref } from "react";

interface Props extends GridProps {
  children: ReactNode;
  title: string;
}

export const SettingCardItem = forwardRef(({ children, title, ...gridProps }: Props, ref) => {
  return (
    <>
      <Grid templateColumns="auto 1fr auto" {...gridProps}>
        <GridItem colStart={1} colEnd={2} alignSelf="center">
          <Text>{title}</Text>
        </GridItem>
        <GridItem colStart={3} colEnd={4}>
          <Stack my={2} spacing={2}>
            {children}
          </Stack>
        </GridItem>
      </Grid>
    </>
  );
});
