import React, { useReducer } from "react";

export const GameStateStore = React.createContext({});
export const GameDispatchStore = React.createContext({});

const GameStoreProvider = ({ uiState, children }) => {
  const [state, dispatch] = useReducer(
    uiState.getReducer(),
    uiState.getInitialState()
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
