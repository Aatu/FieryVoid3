import { useContext } from "react";
import { UIStateHandlerContext } from "../view/game/GameStoreProvider";
import UIState from "../view/game/ui/UIState";

export const useUiStateHandler = (): UIState => {
  const uiState = useContext(UIStateHandlerContext);

  if (!uiState) {
    throw new Error("UIState not found");
  }

  return uiState;
};
