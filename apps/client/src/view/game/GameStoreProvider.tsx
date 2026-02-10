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
