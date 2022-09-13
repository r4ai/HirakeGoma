import React from "react";
import ReactDOM from "react-dom/client";
import { ChakraProvider, ColorModeScript, DarkMode } from "@chakra-ui/react";
import { Router } from "./components/Router";
import theme from "./Theme";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <ChakraProvider theme={theme}>
      <ColorModeScript initialColorMode={theme.config.initialColorMode} />
      <DarkMode>
        <Router />
      </DarkMode>
    </ChakraProvider>
  </React.StrictMode>
);
