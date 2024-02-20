import React, { Suspense } from "react";
import { Spin } from "./components";
import { MenuKey } from "./modules/navbar";
import { Authentication } from "./modules/user";
import { Router } from "./routes";

const App = () => (
  <Suspense fallback={<Spin fullscreen />}>
    <MenuKey>
      <Authentication>
        <Router />
      </Authentication>
    </MenuKey>
  </Suspense>
);
export default App;
