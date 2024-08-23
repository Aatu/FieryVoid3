import React, { ReactNode, useReducer } from "react";
import UIState from "./ui/UIState";

export const GameStateStore = React.createContext({});
export const GameDispatchStore = React.createContext({});

const GameStoreProvider: React.FC<{
  uiState: UIState;
  children: ReactNode;
}> = ({ uiState, children }) => {
  const [state, dispatch] = useReducer(
    uiState.getReducer(),
    uiState.getState()
  );

  uiState.setDispatch(dispatch);

  return (
    <GameDispatchStore.Provider value={dispatch}>
      <GameStateStore.Provider value={state}>
        {children}
      </GameStateStore.Provider>
    </GameDispatchStore.Provider>
  );
};

export default GameStoreProvider;
