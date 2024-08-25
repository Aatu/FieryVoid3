import { createBrowserRouter } from "react-router-dom";
import Game from "./view/game";
import Logout from "./view/logout";
import { BaseView } from "./view/baseView";
import { Route } from "./Route";

export const router = createBrowserRouter([
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
