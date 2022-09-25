import React from "react";
import ReactDOM from "react-dom/client";
import { RecoilRoot } from "recoil";

import App from "./App";
import { ThemeManager } from "./ThemeManager";

import "./main.css";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <RecoilRoot>
      <ThemeManager>
        <App />
      </ThemeManager>
    </RecoilRoot>
  </React.StrictMode>
);
