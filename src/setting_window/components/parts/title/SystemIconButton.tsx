import { IconButton, IconButtonProps } from "@chakra-ui/react";
import { FC } from "react";

export const SystemIconButton: FC<IconButtonProps> = (props) => {
  return <IconButton {...props} variant="ghost"></IconButton>;
};
