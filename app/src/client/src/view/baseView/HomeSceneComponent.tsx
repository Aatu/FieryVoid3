import React, { useCallback, useEffect, useMemo, useRef } from "react";
import styled from "styled-components";
import HomeScene from "./HomeScene";

const WebglCanvas = styled.div`
  position: fixed;
  top: 0px;
  bottom: 0px;
  left: 0px;
  right: 0px;
  display: flex;
  background-size: cover;
  background-color: #0b121a;
  box-shadow: inset 0px 0px 200px rgba(0, 0, 0, 1);
  z-index: -2;
`;

const HomeSceneComponent: React.FC = () => {
  const canvasRef = useRef<HTMLDivElement>(null);

  const getDimensions = useCallback(() => {
    if (!canvasRef.current) {
      return null;
    }

    return {
      width: canvasRef.current?.offsetWidth,
      height: canvasRef.current?.offsetHeight,
    };
  }, []);

  useEffect(() => {
    if (!canvasRef.current) {
      return;
    }

    const onResize = () => {
      if (!canvasRef.current) {
        return;
      }

      const dimensions = getDimensions();
      if (!dimensions) {
        return;
      }

      scene.onResize(dimensions);
    };

    const dimensions = getDimensions();
    if (!dimensions) {
      return;
    }

    const scene = new HomeScene(canvasRef.current, dimensions);

    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("resize", onResize);
    };
  }, [getDimensions]);

  return useMemo(() => <WebglCanvas ref={canvasRef} />, []);
};

export default HomeSceneComponent;
