import { createStore } from "./redux";
import * as reducers from "./ducks";
import promiseMiddleware from "redux-promise-middleware";
import thunk from "redux-thunk";

let store = null;

const getStore = () => {
  if (store) {
    return store;
  }

  store = createStore(reducers, [thunk, promiseMiddleware], [], undefined);

  return store;
};

export default getStore;
