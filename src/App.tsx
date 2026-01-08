import { BrowserRouter, useRoutes } from "react-router-dom";
import { createRouteObjects } from "./routes";

const AppRoutes = () => {
  const routes = useRoutes(createRouteObjects());
  return routes;
};

export const App = () => {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
};
