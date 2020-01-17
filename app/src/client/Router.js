import React, { Component, useContext } from "react";
import { BrowserRouter as Router, Route, Redirect } from "react-router-dom";
import Home from "./view/home";
import Game from "./view/game";
import Register from "./view/register";
import Logout from "./view/logout";
import CreateGame from "./view/createGame";
import { StateStore } from "./state/StoreProvider";

const PrivateRoute = ({ component: Component, authed, ...rest }) => {
  return (
    <Route
      {...rest}
      render={props =>
        authed === true ? (
          <Component {...props} />
        ) : (
          <Redirect
            to={{ pathname: "/login", state: { from: props.location } }}
          />
        )
      }
    />
  );
};

class Routes extends Component {
  render() {
    const state = this.context;
    const user = state.currentUser;

    if (user === undefined) {
      return null;
    }

    return (
      <Router>
        <Route exact path="/" component={Home} />
        <PrivateRoute
          authed={Boolean(user)}
          exact
          path="/createGame"
          component={CreateGame}
        />
        <Route exact path="/logout" component={Logout} />
        <Route path="/game/:gameid" component={Game} />
      </Router>
    );
  }
}

Routes.contextType = StateStore;

export default Routes;
