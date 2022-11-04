import { Box } from "@chakra-ui/react";
import { FC, ReactNode } from "react";

interface Props {
  children: ReactNode;
}

export const SettingItemBase: FC<Props> = ({ children }) => {
  return (
    <Box p={2} _hover={{ outline: `1px solid`, outlineColor: "whiteAlpha.300" }}>
      {children}
    </Box>
  );
};
