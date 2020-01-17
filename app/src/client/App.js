import React, { Component } from "react";
import Router from "./Router";

import StoreProvider from "./state/StoreProvider";

class App extends Component {
  render() {
    return (
      <StoreProvider>
        <Router />
      </StoreProvider>
    );
  }
}

export default App;
