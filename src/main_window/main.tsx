import React from "react";
import ReactDOM from "react-dom/client";
import { register } from "@tauri-apps/api/globalShortcut";

import App from "./App";
import { ThemeManager } from "./ThemeManager";

import "./main.css";
import { coreWindowToggleVisibility } from "../commands/core";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <ThemeManager>
      <App />
    </ThemeManager>
  </React.StrictMode>
);
