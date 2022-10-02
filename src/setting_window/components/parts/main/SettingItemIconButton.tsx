import { IconButtonProps, IconButton } from "@chakra-ui/react";
import { FC, ReactNode } from "react";

interface Props extends IconButtonProps {
  children?: ReactNode;
}

export const SettingItemIconButton: FC<Props> = ({ children, ...props }) => {
  return (
    <IconButton colorScheme="orange" variant="outline" size="sm" w="-webkit-fit-content" h={6} {...props}>
      {children}
    </IconButton>
  );
};
