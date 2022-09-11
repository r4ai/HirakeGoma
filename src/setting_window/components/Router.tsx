import { FC } from "react";
import { HashRouter, Routes, Route, BrowserRouter } from "react-router-dom";

import { General } from "./pages/general";
import { CorePlugins } from "./pages/core_plugins";
import { Debug } from "./pages/debug";
import { Layout } from "./Layout";

export const Router: FC = () => {
  return (
    <>
      <HashRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<General />}></Route>
            <Route path="/general" element={<General />}></Route>
            <Route path="/core_plugins" element={<CorePlugins />}></Route>
            <Route path="/debug" element={<Debug />}></Route>
          </Route>
        </Routes>
      </HashRouter>
    </>
  );
};
