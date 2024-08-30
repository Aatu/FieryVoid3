import { useGameStore } from "../view/game/GameStoreProvider";
import { SystemMenuUiState } from "../view/game/ui/UIState";

const comparison = (a: SystemMenuUiState, b: SystemMenuUiState) => {
  if (a.activeSystemElement !== b.activeSystemElement) {
    return false;
  }

  if (a.activeSystemId !== b.activeSystemId) {
    return false;
  }

  if (a.systemInfoMenuProvider !== b.systemInfoMenuProvider) {
    return false;
  }

  return true;
};

export const useSystemMenu = (): SystemMenuUiState => {
  const state = useGameStore(
    ({ gameState }) => gameState.systemMenu,
    comparison
  );

  return state;
};
