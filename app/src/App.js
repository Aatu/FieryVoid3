import React, { Component } from "react";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import Home from "./client/home";
import Game from "./client/game";

class App extends Component {
  render() {
    return (
      <Router>
        <Route exact path="/" component={Home} />
        <Route path="/game/:gameid" component={Game} />
      </Router>
    );
  }
}

export default App;
