import React from "react";
import ReactDOM from "react-dom/client";
import { RecoilRoot } from "recoil";

import App from "./App";

import "./main.css";
import { ThemeProvider } from "@emotion/react";

import { carbon } from "./theme/carbon";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <RecoilRoot>
      <ThemeProvider theme={carbon}>
        <App />
      </ThemeProvider>
    </RecoilRoot>
  </React.StrictMode>
);
