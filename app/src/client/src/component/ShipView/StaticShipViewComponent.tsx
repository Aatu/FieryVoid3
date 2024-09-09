import Ship from "@fieryvoid3/model/src/unit/Ship";
import { LegacyRef, useEffect, useMemo, useRef } from "react";
import styled from "styled-components";
import { ShipViewScene } from "./ShipViewScene";

const WebglCanvas = styled.canvas``;

type Props = {
  ship: Ship;
  size: number;
};

const div = document.createElement("div");
const shipViewScene = new ShipViewScene();
shipViewScene.init(div);

export const StaticShipViewComponent: React.FC<Props> = ({ ship, size }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) {
      return;
    }

    const loadShip = async () => {
      if (!canvasRef.current) {
        return;
      }

      const imageData = await shipViewScene.renderShipImage(size, ship);

      const ctx = canvasRef.current!.getContext(
        "2d"
      ) as CanvasRenderingContext2D;

      const image = new Image();
      image.onload = function () {
        ctx.drawImage(image, 0, 0);
      };
      image.src = imageData;
    };

    loadShip();
  }, [size, ship]);

  return useMemo(
    () => (
      <WebglCanvas
        width={size}
        height={size}
        ref={canvasRef as LegacyRef<HTMLCanvasElement>}
      />
    ),
    [size]
  );
};
