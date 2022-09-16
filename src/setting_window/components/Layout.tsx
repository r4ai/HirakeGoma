import { FC, ReactNode, useState } from "react";
import { VStack, Grid, GridItem, Box, useColorModeValue } from "@chakra-ui/react";
import { TitleBar } from "./organisms/TitleBar";
import { SideBar } from "./organisms/SideBar";
import { Outlet } from "react-router-dom";
import { title } from "process";

export type navSize = "small" | "large";

export const Layout: FC = () => {
  const [navSize, setNavSize] = useState<navSize>("large");

  const bg = useColorModeValue("white", "black");
  const navBg = useColorModeValue("gray.200", "gray.800");
  const titleBg = useColorModeValue("gray.100", "gray.900");
  const mainBg = useColorModeValue("gray.100", "gray.900");

  return (
    <>
      <Grid
        templateAreas={`"nav title"
                        "nav main"`}
        gridTemplateRows={"20px 1fr"}
        gridTemplateColumns={`${navSize === "large" ? "150px" : "30px"} 1fr`}
        h="100vh"
      >
        <GridItem area={"title"} bgColor={titleBg}>
          TitleBar
        </GridItem>
        <GridItem area={"nav"} bgColor={navBg}>
          <SideBar navSize="large" />
        </GridItem>
        <GridItem area={"main"} bgColor={mainBg} px={5} py={2}>
          <Outlet />
        </GridItem>
      </Grid>
    </>
  );
};
