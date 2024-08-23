import React, { ReactNode, useRef, useEffect, useMemo } from "react";
import styled from "styled-components";
import UIState from "./UIState";

const Container = styled.div`
  position: absolute;
  top: 0px;
  left: 0px;
`;

type Props = {
  uiState: UIState;
  getPosition: () => { x: number; y: number };
  marginTop?: number;
  marginLeft?: number;
  children: ReactNode;
};

const GamePositionComponent: React.FC<Props> = ({
  children,
  getPosition,
  marginLeft = 0,
  marginTop = 0,
  uiState,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const positionRef = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    const callback = () => {
      if (!containerRef.current) {
        return;
      }

      const position = positionRef.current;
      const newPosition = getPosition();

      if (
        !position ||
        position.x !== newPosition.x ||
        position.y !== newPosition.y
      ) {
        positionRef.current = newPosition;

        containerRef.current.style.left = `${newPosition.x + marginLeft}px`;
        containerRef.current.style.top = `${newPosition.y + marginTop}px`;
      }
    };

    uiState.subscribeToRender(callback);

    return () => uiState.unsubscribeFromRender(callback);
  }, [containerRef, getPosition, marginLeft, marginTop, positionRef, uiState]);

  return useMemo(
    () => <Container ref={containerRef}>{children}</Container>,
    [children]
  );
};

export default GamePositionComponent;
