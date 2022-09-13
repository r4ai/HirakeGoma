import { FC } from "react";
import { HashRouter, Routes, Route, BrowserRouter } from "react-router-dom";

import { General } from "./pages/general";
import { CorePlugins } from "./pages/core_plugins";
import { Debug } from "./pages/debug";
import { Layout } from "./Layout";
import { Hotkey } from "./pages/hotkey";
import { Theme } from "./pages/theme";
import { Plugin } from "./pages/plugin";
import { Database } from "./pages/database";

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
