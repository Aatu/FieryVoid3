import React, { Component } from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import { Provider } from "react-redux";
import Home from "./view/home";
import Game from "./view/game";
import Login from "./view/login";
import getStore from "./state/store";

const store = getStore();

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <Router>
          <Route exact path="/" component={Home} />
          <Route exact path="/login" component={Login} />
          <Route exact path="/register" component={Home} />
          <Route path="/game/:gameid" component={Game} />
        </Router>
      </Provider>
    );
  }
}

export default App;
