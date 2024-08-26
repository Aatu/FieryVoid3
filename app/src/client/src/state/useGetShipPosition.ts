import { useMemo } from "react";
import { useUiStateHandler } from "./useUIStateHandler";

export const useGetShipPosition = (
  shipId: string
): (() => { x: number; y: number }) => {
  const uiState = useUiStateHandler();

  return useMemo(() => {
    const { shipIconContainer, coordinateConverter } = uiState.getServices();
    const icon = shipIconContainer.getIconById(shipId);
    const getPosition = () =>
      coordinateConverter.fromGameToViewPort(icon.getPosition());

    return getPosition;
  }, [shipId, uiState]);
};
