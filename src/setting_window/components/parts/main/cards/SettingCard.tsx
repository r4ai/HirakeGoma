import { Card, Heading, Spacer } from "@chakra-ui/react";
import { FC, ReactNode } from "react";

interface Props {
  children: ReactNode;
}

export const SettingCard: FC<Props> = ({ children }) => {
  return (
    <>
      <Card variant="outline" size="sm">
        {children}
      </Card>
    </>
  );
};
