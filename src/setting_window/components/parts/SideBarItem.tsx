import { Button } from "@chakra-ui/react";
import { FC } from "react";
import { Link } from "react-router-dom";

interface Props {
  icon: JSX.Element;
  title: string;
  link: string;
}

export const SideBarItem: FC<Props> = ({ icon, title, link }) => {
  return (
    <>
      <Link to={link} css={{ width: "100%" }}>
        <Button leftIcon={icon} variant="ghost" w="100%" justifyContent="flex-start" p={3}>
          {title}
        </Button>
      </Link>
    </>
  );
};
