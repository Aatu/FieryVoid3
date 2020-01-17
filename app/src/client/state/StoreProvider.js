import React, { useReducer, useEffect } from "react";
import { reducer, getCurrentUser } from "./actions";

export const StateStore = React.createContext({});
export const DispatchStore = React.createContext({});

const initialState = {
  currentUser: undefined
};

const StoreProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    getCurrentUser(dispatch);
  }, []);

  return (
    <DispatchStore.Provider value={dispatch}>
      <StateStore.Provider value={state}>{children}</StateStore.Provider>
    </DispatchStore.Provider>
  );
};

export default StoreProvider;
