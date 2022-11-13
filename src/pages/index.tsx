import { Route, Routes } from "react-router-dom";
import { ROUTES } from "./routes";

import { Home } from "./Home";

export const Pages = () => {
  return (
    <Routes>
      <Route path={ROUTES.INDEX} element={<Home />} />
    </Routes>
  );
};
