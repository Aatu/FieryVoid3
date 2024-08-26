import React, { createContext, ReactNode, useEffect } from "react";
import UIState, { defaultState, State } from "./ui/UIState";
import { createWithEqualityFn } from "zustand/traditional";
import { shallow } from "zustand/shallow";

type GameStoreState = {
  gameState: State;
  setState: (gameState: State) => void;
};

export const useGameStore = createWithEqualityFn<GameStoreState>(
  (set) => ({
    gameState: defaultState,
    setState: (gameState) => set({ gameState }),
  }),
  shallow
);

export const UIStateHandlerContext = createContext<UIState>(
  null as unknown as UIState
);

const GameStoreProvider: React.FC<{
  uiState: UIState;
  children: ReactNode;
}> = ({ uiState, children }) => {
  const setState = useGameStore((state) => state.setState);

  useEffect(() => {
    uiState.setDispatch(setState);
  }, [setState, uiState]);

  return (
    <UIStateHandlerContext.Provider value={uiState}>
      {children}
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
