//* React
import { FC, useState, ReactNode } from "react";
import { Link } from "react-router-dom";

//* MUI
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";

//* Components
import { SideBar } from "./organisms/SideBar_buckup";
import { TitleBar } from "./organisms/TitleBar";

//* CSS
import { css } from "@emotion/react";

interface Props {
  children: ReactNode;
}

const body = css`
  margin: 0;
`;

export const Layout: FC = ({ children, ...props }: Props) => {
  return (
    <>
      <TitleBar />
      <Grid container direction="row" justifyContent="flex-start" alignItems="flex-start" css={body}>
        <Grid item>
          <ActionBar />
        </Grid>
        <Grid item xs>
          <div className="main">{children}</div>
        </Grid>
      </Grid>
    </>
  );
};
