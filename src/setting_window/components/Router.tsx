import { FC } from "react";
import { HashRouter, Routes, Route, BrowserRouter } from "react-router-dom";

import { Layout } from "./Layout";
import { CorePlugins } from "./pages/core_plugins";
import { Database } from "./pages/database";
import { Debug } from "./pages/debug";
import { General } from "./pages/general";
import { Hotkey } from "./pages/hotkey";
import { Plugin } from "./pages/plugin";
import { Theme } from "./pages/theme";

export const Router: FC = () => {
  return (
    <>
      <HashRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<General />}></Route>
            <Route path="/general" element={<General />}></Route>
            <Route path="/core_plugins" element={<CorePlugins />}></Route>
            <Route path="/plugin" element={<Plugin />}></Route>
            <Route path="/database" element={<Database />}></Route>
            <Route path="/theme" element={<Theme />}></Route>
            <Route path="/hotkey" element={<Hotkey />}></Route>
            <Route path="/debug" element={<Debug />}></Route>
          </Route>
        </Routes>
      </HashRouter>
    </>
  );
};
