import { useContext } from "react";
import { UIStateContext } from "../view/game/GameStoreProvider";
import UIState from "../view/game/ui/UIState";

export const useUiState = (): UIState => {
  const uiState = useContext(UIStateContext);

  if (!uiState) {
    throw new Error("UIState not found");
  }

  return uiState;
};
