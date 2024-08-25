import React, { createContext, ReactNode, useReducer } from "react";
import UIState from "./ui/UIState";

export const GameStateStore = createContext({});
export const GameDispatchStore = createContext({});
export const UIStateContext = createContext<UIState | null>(null);

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
    <UIStateContext.Provider value={uiState}>
      <GameDispatchStore.Provider value={dispatch}>
        <GameStateStore.Provider value={state}>
          {children}
        </GameStateStore.Provider>
      </GameDispatchStore.Provider>
    </UIStateContext.Provider>
  );
};

export default GameStoreProvider;

/*
import React, { createContext, ReactNode, useReducer } from "react";
import UIState from "./ui/UIState";

export const GameStateStore = createContext({});
export const GameDispatchStore = createContext({});
export const UIStateContext = createContext<UIState | null>(null);

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
    <UIStateContext.Provider value={uiState}>
      <GameDispatchStore.Provider value={dispatch}>
        <GameStateStore.Provider value={state}>
          {children}
        </GameStateStore.Provider>
      </GameDispatchStore.Provider>
    </UIStateContext.Provider>
  );
};

export default GameStoreProvider;

*/
