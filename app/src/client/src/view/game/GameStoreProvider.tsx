import React, { createContext, ReactNode, useState } from "react";
import UIState, { State } from "./ui/UIState";
import { createContext as createSelectableContext } from "use-context-selector";

export const UIStateHandlerContext = createContext<UIState>(
  null as unknown as UIState
);
export const UIStateContext = createSelectableContext<State>(
  null as unknown as State
);

const GameStoreProvider: React.FC<{
  uiState: UIState;
  children: ReactNode;
}> = ({ uiState, children }) => {
  const [state, setState] = useState<State>(uiState.getState());

  uiState.setDispatch(setState);

  return (
    <UIStateHandlerContext.Provider value={uiState}>
      <UIStateContext.Provider value={state}>
        {children}
      </UIStateContext.Provider>
    </UIStateHandlerContext.Provider>
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
