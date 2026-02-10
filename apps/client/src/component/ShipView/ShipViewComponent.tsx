import Ship from "@fieryvoid3/model/src/unit/Ship";
import { LegacyRef, useEffect, useMemo, useRef } from "react";
import styled from "styled-components";
import { ShipViewScene } from "./ShipViewScene";

type WebGlCanvasProps = {
  $size: number;
};

const WebglCanvas = styled.div<WebGlCanvasProps>`
  display: flex;
  width: ${({ $size }) => $size + "px;"};
  height: ${({ $size }) => $size + "px;"};
`;

type Props = {
  ship: Ship;
  size: number;
};

export const ShipViewComponent: React.FC<Props> = ({ ship, size }) => {
  const canvasRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!canvasRef.current) {
      return;
    }

    const shipViewScene = new ShipViewScene();
    shipViewScene.init(canvasRef.current);

    shipViewScene.showShip(size, ship);

    return () => {
      shipViewScene.deactivate();
    };
  }, [size, ship]);

  return useMemo(
    () => (
      <WebglCanvas $size={size} ref={canvasRef as LegacyRef<HTMLDivElement>} />
    ),
    []
  );
};
