import { createBrowserRouter } from "react-router-dom";
import Game from "./view/game";
import Logout from "./view/logout";
import { BaseView } from "./view/baseView";
import { Route } from "./Route";
import CreateGame from "./view/createGame/CreateGame";
import Home from "./view/home/Home";

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
    path: "/",
    element: (
      <Route>
        <BaseView>
          <Home />
        </BaseView>
      </Route>
    ),
  },
  {
    path: "/createGame",
    element: (
      <Route isPrivate>
        <BaseView>
          <CreateGame />
        </BaseView>
      </Route>
    ),
  },
]);
