import React, {
  KeyboardEventHandler,
  LegacyRef,
  MouseEventHandler,
  useCallback,
  useEffect,
  useMemo,
  useRef,
} from "react";
import styled from "styled-components";
import Game from "../Game";
import { distance } from "@fieryvoid3/model/src/utils/math";
import { useForceRerender } from "../../../util/useForceRerender";

const WebglCanvas = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  z-index: 1;
  display: flex;
  width: 100%;
  height: 100%;
  background-size: cover;
  background-color: transparent;
  box-shadow: inset 0px 0px 200px rgba(0, 0, 0, 1);
`;
//background-color: #0b121a;

type BackgroundContainerProps = {
  $bgNumber: number;
};

const BackgroundContainer = styled.div<BackgroundContainerProps>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  z-index: 0;
  width: 100%;
  height: 100%;
  background-size: cover;
  background-image: ${(props) => `url(/img/background/${props.$bgNumber}.jpg)`};
  opacity: 0.05;
`;

const BackgroundColorContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  z-index: -1;
  width: 100%;
  height: 100%;
  background-color: #000;
`;

const ClickCatcher = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  z-index: 2;
  width: 100%;
  height: 100%;
  background-color: transparent;
`;

const getMousePositionInObservedElement = (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  event: any,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  element: any
): MousePosition => {
  if (event.touches) {
    return {
      x: event.originalEvent.touches[0].pageX - element.offset().left,
      y: event.originalEvent.touches[0].pageY - element.offset().top,
      xR:
        ((event.originalEvent.touches[0].pageX - element.offset().left) /
          window.innerWidth) *
          2 -
        1,
      yR:
        -(
          (event.originalEvent.touches[0].pageY - element.offset().top) /
          window.innerHeight
        ) *
          2 +
        1,
    };
  }

  return {
    x: event.clientX,
    y: event.clientY,
    xR: (event.clientX / element.offsetWidth) * 2 - 1,
    yR: -(event.clientY / element.offsetHeight) * 2 + 1,
  };
};

type MousePosition = {
  x: number;
  y: number;
  xR: number;
  yR: number;
};

const GameSceneComponent: React.FC<{ game: Game }> = ({ game }) => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const clickCatcherRef = useRef<HTMLDivElement>(null);
  const mouseDataRef = useRef<{
    mouseDownPosition: MousePosition | null;
    lastDraggingPosition: MousePosition | null;
    draggingThreshold: 5;
  }>({
    mouseDownPosition: null,
    lastDraggingPosition: null,
    draggingThreshold: 5,
  });
  useForceRerender();

  const hasCanvasRef = Boolean(canvasRef.current);
  const hasClickCatcherRef = Boolean(clickCatcherRef.current);

  const onTouchStart = useCallback((event: TouchEvent) => {
    event.stopPropagation();
    event.preventDefault();
  }, []);

  const onWheel = useCallback(
    (event: WheelEvent) => {
      event.stopPropagation();
      //event.stopImmediatePropagation();
      event.preventDefault();
      const delta = Math.sign(event.deltaY);
      game.onMouseWheel(delta);
    },
    [game]
  );

  const onResize = useCallback(() => {
    game.onResize();
  }, [game]);

  const onMouseDown: MouseEventHandler = useCallback((event) => {
    event.stopPropagation();
    event.preventDefault();
    mouseDataRef.current.mouseDownPosition = getMousePositionInObservedElement(
      event,
      clickCatcherRef.current
    );
  }, []);

  const onMouseUp: MouseEventHandler = useCallback(
    (event) => {
      event.stopPropagation();
      event.preventDefault();

      if (!mouseDataRef.current.lastDraggingPosition) {
        game.onMouseUp(
          getMousePositionInObservedElement(event, clickCatcherRef.current),
          event.button
        );
      }

      mouseDataRef.current.mouseDownPosition = null;
      mouseDataRef.current.lastDraggingPosition = null;
    },
    [game]
  );

  const onMouseMove: MouseEventHandler = useCallback(
    (event) => {
      event.stopPropagation();
      event.preventDefault();

      if (mouseDataRef.current.mouseDownPosition === null) {
        game.onMouseMove(
          getMousePositionInObservedElement(event, canvasRef.current)
        );
        return;
      }

      const position = getMousePositionInObservedElement(
        event,
        clickCatcherRef.current
      );

      if (
        !mouseDataRef.current.lastDraggingPosition &&
        distance(mouseDataRef.current.mouseDownPosition, position) >
          mouseDataRef.current.draggingThreshold
      ) {
        mouseDataRef.current.lastDraggingPosition =
          mouseDataRef.current.mouseDownPosition;
      }

      if (mouseDataRef.current.lastDraggingPosition) {
        const delta = {
          x: position.x - mouseDataRef.current.lastDraggingPosition.x,
          y: position.y - mouseDataRef.current.lastDraggingPosition.y,
        };

        mouseDataRef.current.lastDraggingPosition = position;
        game.onDrag(position, delta);
      }
    },
    [game]
  );

  const onMouseOut: MouseEventHandler = useCallback(() => {
    mouseDataRef.current.mouseDownPosition = null;
    mouseDataRef.current.lastDraggingPosition = null;
    game.onMouseOut();
  }, [game]);

  const onKeyDown = useCallback(
    (event: KeyboardEvent) => {
      game.onKeyDown(event);
    },
    [game]
  );

  const onKeyUp = useCallback(
    (event: KeyboardEvent) => {
      game.onKeyUp(event);
    },
    [game]
  );

  const onKeyUpDivHandler: KeyboardEventHandler<HTMLDivElement> = useCallback(
    (event) => {
      onKeyUp(event as unknown as KeyboardEvent);
    },
    [onKeyUp]
  );

  useEffect(() => {
    if (
      !canvasRef.current ||
      game.init ||
      canvasRef.current?.offsetHeight === 0 ||
      canvasRef.current?.offsetWidth === 0
    ) {
      return;
    }

    game.initRender(canvasRef.current);
  }, [hasCanvasRef, game]);

  useEffect(() => {
    if (!clickCatcherRef.current) {
      return;
    }

    const element = clickCatcherRef.current;
    element.addEventListener("wheel", onWheel);

    return () => {
      element.removeEventListener("wheel", onWheel);
    };
  }, [hasClickCatcherRef, onWheel]);

  useEffect(() => {
    window.addEventListener("resize", onResize);
    window.addEventListener("touchstart", onTouchStart);
    document.addEventListener("keydown", onKeyDown, false);
    document.addEventListener("keyup", onKeyUp, false);

    return () => {
      window.removeEventListener("resize", onResize);
      window.removeEventListener("touchstart", onTouchStart);
      document.removeEventListener("keydown", onKeyDown, false);
      document.removeEventListener("keyup", onKeyUp, false);
    };
  }, [onKeyDown, onKeyUp, onResize, onTouchStart]);

  const bgNumber = useMemo(() => Math.floor(Math.random() * 8) + 1, []);
  return useMemo(() => {
    return (
      <>
        <BackgroundColorContainer />
        <ClickCatcher
          ref={clickCatcherRef}
          onMouseOut={onMouseOut}
          onMouseDown={onMouseDown}
          onMouseUp={onMouseUp}
          onMouseMove={onMouseMove}
          onKeyUp={onKeyUpDivHandler}
          onContextMenu={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
        />
        <BackgroundContainer $bgNumber={bgNumber} />
        <WebglCanvas
          id="game-canvas-container"
          ref={canvasRef as LegacyRef<HTMLDivElement>}
        />
      </>
    );
  }, [
    onKeyUpDivHandler,
    onMouseDown,
    onMouseMove,
    onMouseOut,
    onMouseUp,
    bgNumber,
  ]);
};

export default GameSceneComponent;
