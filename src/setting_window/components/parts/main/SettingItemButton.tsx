import { Button, ButtonProps } from "@chakra-ui/react";
import { FC, ReactElement } from "react";

interface Props extends ButtonProps {
  children?: ReactElement;
}

export const SettingItemButton: FC<Props> = ({ children, ...props }) => {
  return <Button {...props}>{children}</Button>;
};
