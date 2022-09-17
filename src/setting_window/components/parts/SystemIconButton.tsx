import { IconButton, IconButtonProps } from "@chakra-ui/react";
import { FC, ReactElement } from "react";

export const SystemIconButton: FC<IconButtonProps> = (props) => {
  return <IconButton {...props} variant="ghost"></IconButton>;
};
