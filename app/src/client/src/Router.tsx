import React, { ReactNode } from "react";
import {
  createBrowserRouter,
  RouterProvider,
  redirect,
} from "react-router-dom";
import Game from "./view/game";
import Logout from "./view/logout";
import { BaseView } from "./view/baseView";
import { useUser } from "./state/userHooks";

export const Route: React.FC<{ isPrivate?: boolean; children: ReactNode }> = ({
  isPrivate,
  children,
}) => {
  const { data: currentUser, isLoading } = useUser();

  if (isLoading) {
    return null;
  }

  const authed = Boolean(currentUser);

  if (!authed && isPrivate) {
    redirect("/");
    return null;
  }

  return <>{children}</>;
};

const router = createBrowserRouter([
  {
    path: "/game/:gameid",
    element: (
      <Route isPrivate>
        <Game />
      </Route>
    ),
  },
  {
    path: "/logout",
    element: (
      <Route isPrivate>
        <Logout />
      </Route>
    ),
  },
  {
    path: "*",
    element: (
      <Route>
        <BaseView />
      </Route>
    ),
  },
]);

const Routes = () => {
  return <RouterProvider router={router} />;
};

export default Routes;
