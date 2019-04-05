import React, { Component } from "react";
import { BrowserRouter as Router, Route, Redirect } from "react-router-dom";
import { connect } from "react-redux";
import Home from "./view/home";
import Game from "./view/game";
import Login from "./view/login";
import Register from "./view/register";
import Logout from "./view/logout";

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
    const { user } = this.props;
    if (user === undefined) {
      return null;
    }

    return (
      <Router>
        <PrivateRoute authed={Boolean(user)} exact path="/" component={Home} />
        <Route exact path="/login" component={Login} />
        <Route exact path="/logout" component={Logout} />
        <Route exact path="/register" component={Register} />
        <PrivateRoute
          authed={Boolean(user)}
          path="/game/:gameid"
          component={Game}
        />
      </Router>
    );
  }
}

export default connect(state => ({ user: state.user.current }))(Routes);
