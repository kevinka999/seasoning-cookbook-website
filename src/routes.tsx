import type { RouteObject } from "react-router-dom";
import { PageLayout } from "./components/PageLayout";
import { AuthGuard } from "./components/AuthGuard";
import { Home } from "./pages/Home";
import { CreateRecipe } from "./pages/CreateRecipe";

type RouteConfig = {
  path: string;
  element: React.ReactElement;
};

export const publicRoutes: RouteConfig[] = [
  {
    path: "/",
    element: <Home />,
  },
];

export const protectedRoutes: RouteConfig[] = [
  {
    path: "/create",
    element: <CreateRecipe />,
  },
];

export const createRouteObjects = (): RouteObject[] => {
  const publicRouteObjects: RouteObject[] = publicRoutes.map((route) => ({
    path: route.path,
    element: route.element,
  }));

  const protectedRouteObjects: RouteObject[] = protectedRoutes.map((route) => ({
    path: route.path,
    element: <AuthGuard>{route.element}</AuthGuard>,
  }));

  return [
    {
      element: <PageLayout />,
      children: [...publicRouteObjects, ...protectedRouteObjects],
    },
  ];
};
