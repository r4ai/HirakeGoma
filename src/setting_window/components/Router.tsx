import { FC } from "react";
import { HashRouter, Routes, Route } from "react-router-dom";

import { General } from "../pages/general";
import { CorePlugins } from "../pages/core_plugins";

export const Router: FC = () => {
  return (
    <>
      <HashRouter>
        <Routes>
          <Route index element={<General />}></Route>
          <Route path="/General" element={<General />}></Route>
          <Route path="/core_plugins" element={<CorePlugins />}></Route>
        </Routes>
      </HashRouter>
    </>
  );
};
