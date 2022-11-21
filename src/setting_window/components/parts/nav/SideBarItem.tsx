import { Button } from "@chakra-ui/react";
import { FC } from "react";
import { Link } from "react-router-dom";
import { useActiveIndex } from "./SideBarProvider";

interface Props {
  icon: JSX.Element;
  title: string;
  link: string;
  index: number;
}

export const SideBarItem: FC<Props> = ({ icon, title, link, index }) => {
  const { activeIndex, setActiveIndex } = useActiveIndex();

  function handleButtonClick() {
    setActiveIndex(index);
  }

  return (
    <>
      <Link to={link} css={{ width: "100%" }}>
        <Button
          leftIcon={icon}
          variant="ghost"
          w="100%"
          justifyContent="flex-start"
          p={3}
          backgroundColor={index === activeIndex ? "whiteAlpha.100" : "rgba(0, 0, 0, 0)"}
          onClick={handleButtonClick}
        >
          {title}
        </Button>
      </Link>
    </>
  );
};
