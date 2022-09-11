import { FC, ReactNode } from "react";
import { Box } from "@chakra-ui/react";

interface Props {
  children: ReactNode;
}

export const SettingItemBase: FC<Props> = ({ children }) => {
  return (
    <Box p={2} _hover={{ outline: "1px solid" }}>
      {children}
    </Box>
  );
};
