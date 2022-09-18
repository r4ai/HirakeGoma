import { FC } from "react";
import { HashRouter, Routes, Route, BrowserRouter } from "react-router-dom";

import { Layout } from "./Layout";
import { Debug, Database, General, Hotkey, Plugin, Theme } from "./pages";

export const Router: FC = () => {
  return (
    <>
      <HashRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<General />}></Route>
            <Route path="/general" element={<General />}></Route>
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
