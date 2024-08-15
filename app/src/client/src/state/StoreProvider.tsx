import React, { useReducer, useEffect, ReactNode } from "react";
import { reducer, getCurrentUser } from "./actions";

export const StateStore = React.createContext({});
export const DispatchStore = React.createContext({});

const initialState = {
  currentUser: undefined,
};

const StoreProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
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
