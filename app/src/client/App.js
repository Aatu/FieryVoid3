import React, { Component } from "react";
import Router from "./Router";
import { Provider } from "react-redux";

import getStore from "./state/store";
import { getCurrentUser } from "./state/ducks/user";

const store = getStore();

getCurrentUser(store.dispatch)();

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <Router />
      </Provider>
    );
  }
}

export default App;
