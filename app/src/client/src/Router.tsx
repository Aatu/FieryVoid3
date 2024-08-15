import React, { Component, useContext } from "react";
import { BrowserRouter as Router, Route, Redirect } from "react-router-dom";
import Game from "./view/game";
import Logout from "./view/logout";
import { StateStore } from "./state/StoreProvider";
import { BaseView } from "./view/baseView";

export const PrivateRoute: React.FC<{ component: React.FC }> = ({
  component: Component,
  ...rest
}) => {
  const { currentUser } = useContext(StateStore);

  const authed = Boolean(currentUser);

  return (
    <Route
      {...rest}
      render={(props) =>
        authed === true ? (
          <Component {...props} />
        ) : (
          <Redirect to={{ pathname: "/", state: { from: props.location } }} />
        )
      }
    />
  );
};

const Routes = () => {
  const { currentUser } = useContext(StateStore);

  if (currentUser === undefined) {
    return null;
  }

  return (
    <Router>
      <PrivateRoute exact path="/game/:gameid" component={Game} />
      <Route exact path="/logout" component={Logout} />
      <Route path="*" component={BaseView} />
    </Router>
  );
};

export default Routes;
