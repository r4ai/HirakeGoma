import { Button, ButtonProps } from "@chakra-ui/react";
import { FC, ReactNode } from "react";

interface Props extends ButtonProps {
  children?: ReactNode;
}

export const SettingItemButton: FC<Props> = ({ children, ...props }) => {
  return (
    <Button colorScheme="red" variant="outline" size="sm" w="-webkit-fit-content" h={6} {...props}>
      {children}
    </Button>
  );
};
