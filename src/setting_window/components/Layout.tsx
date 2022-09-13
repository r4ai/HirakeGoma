import { FC, ReactNode, useState } from "react";
import { VStack, Grid, GridItem, Box } from "@chakra-ui/react";
import { TitleBar } from "./organisms/TitleBar";
import { SideBar } from "./organisms/SideBar";
import { Outlet } from "react-router-dom";

export type navSize = "small" | "large";

export const Layout: FC = () => {
  const [navSize, setNavSize] = useState<navSize>("large");

  return (
    <>
      <Grid
        templateAreas={`"nav title"
                        "nav main"`}
        gridTemplateRows={"20px 1fr"}
        gridTemplateColumns={`${navSize === "large" ? "150px" : "30px"} 1fr`}
        h="100vh"
        bg={"blackAlpha.900"}
      >
        <GridItem area={"title"} bg="orange.300">
          TitleBar
        </GridItem>
        <GridItem area={"nav"} bg="pink.300">
          <SideBar navSize="large" />
        </GridItem>
        <GridItem area={"main"} bg="green.300" px={5} py={2}>
          <Outlet />
        </GridItem>
      </Grid>
    </>
  );
};
