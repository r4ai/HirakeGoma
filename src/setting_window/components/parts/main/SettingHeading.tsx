import { Heading } from "@chakra-ui/react";
import { FC } from "react";

import { SettingItemBase } from "./SettingItemBase";

interface Props {
  title: string;
}

export const SettingHeading: FC<Props> = ({ title }) => {
  return (
    <SettingItemBase>
      <Heading as="h1" size="lg">
        {title}
      </Heading>
    </SettingItemBase>
  );
};
