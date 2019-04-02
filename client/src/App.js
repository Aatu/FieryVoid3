import React, { Component } from "react";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import Home from "./home";
import Game from "./game";

class App extends Component {
  render() {
    return (
      <Router>
        <div>
          <Route exact path="/" component={Home} />
          <Route path="/game/:gameid" component={Game} />
        </div>
      </Router>
    );
  }
}

export default App;
