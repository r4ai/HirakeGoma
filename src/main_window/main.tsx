import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./main.css";
import { ThemeProvider } from "@emotion/react";
import { carbon } from "./theme/theme";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <ThemeProvider theme={carbon}>
      <App />
    </ThemeProvider>
  </React.StrictMode>
);
