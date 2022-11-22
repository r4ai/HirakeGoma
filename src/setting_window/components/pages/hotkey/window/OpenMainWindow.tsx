import { Input } from "@chakra-ui/react";
import { FC } from "react";
import { SettingItemH } from "../../../parts/main";

function handleSubmit() {}

export const OpenMainWindow: FC = () => {
  return (
    <>
      <SettingItemH title={"Open Search Window"} description={"Open search window."}>
        <Input w={150} />
      </SettingItemH>
    </>
  );
};
