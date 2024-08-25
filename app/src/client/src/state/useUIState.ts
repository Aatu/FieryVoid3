import { UIStateContext } from "../view/game/GameStoreProvider";
import { State } from "../view/game/ui/UIState";
import { useContextSelector } from "use-context-selector";

export const useUIState = (): State => {
  const state = useContextSelector(UIStateContext, (state) => state);

  return state;
};
