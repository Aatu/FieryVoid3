import * as React from "react";
import styled from "styled-components";
import { distance } from "../../../../model/utils/math";

const WebglCanvas = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  background-size: cover;
  background-color: #0b121a;
  box-shadow: inset 0px 0px 200px rgba(0, 0, 0, 1);
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

const getMousePositionInObservedElement = (event, element) => {
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
        1
    };
  }

  return {
    x: event.clientX,
    y: event.clientY,
    xR: (event.clientX / element.offsetWidth) * 2 - 1,
    yR: -(event.clientY / element.offsetHeight) * 2 + 1
  };
};

class GameSceneComponent extends React.Component {
  constructor(props) {
    super(props);
    // create a ref to store the textInput DOM element
    this.canvasRef = React.createRef();
    this.clickCatcherRef = React.createRef();
    this.mouseDownPosition = null;
    this.lastDraggingPosition = null;
    this.draggingThreshold = 5;
  }

  componentDidMount() {
    console.log("Game scene component mounted");
    const { game } = this.props;

    window.addEventListener("resize", this.onResize);
    this.clickCatcherRef.current.addEventListener("wheel", this.onWheel);
    window.addEventListener("touchstart", this.onTouchStart);
    document.addEventListener("keydown", this.onKeyDown.bind(this), false);
    document.addEventListener("keyup", this.onKeyUp.bind(this), false);

    game.initRender(this.canvasRef.current);
  }

  componentWillUnmount() {
    document.removeEventListener("keydown", this.onKeyDown.bind(this), false);
    document.removeEventListener("keyup", this.onKeyUp.bind(this), false);
    window.removeEventListener("resize", this.onResize);
    this.clickCatcherRef.current.removeEventListener("wheel", this.onWheel);
    window.removeEventListener("touchstart", this.onTouchStart);
  }

  onTouchStart = event => {
    event.stopPropagation();
    event.preventDefault();
  };

  onWheel = event => {
    event.stopImmediatePropagation();
    event.preventDefault();
    const { game } = this.props;
    const delta = Math.sign(event.deltaY);
    game.onMouseWheel(delta);
  };

  onResize = () => {
    const { game } = this.props;
    game.onResize();
  };

  onMouseDown(event) {
    event.stopPropagation();
    event.preventDefault();
    this.mouseDownPosition = getMousePositionInObservedElement(
      event,
      this.clickCatcherRef.current
    );
  }

  onMouseUp(event) {
    event.stopPropagation();
    event.preventDefault();

    const { game } = this.props;
    if (!this.lastDraggingPosition) {
      game.onMouseUp(
        getMousePositionInObservedElement(event, this.clickCatcherRef.current),
        event.button
      );
    }

    this.mouseDownPosition = null;
    this.lastDraggingPosition = null;
  }

  onMouseMove(event) {
    event.stopPropagation();
    event.preventDefault();

    const { game } = this.props;

    if (this.mouseDownPosition === null) {
      game.onMouseMove(
        getMousePositionInObservedElement(event, this.canvasRef.current)
      );
      return;
    }

    const position = getMousePositionInObservedElement(
      event,
      this.clickCatcherRef.current
    );

    if (
      !this.lastDraggingPosition &&
      distance(this.mouseDownPosition, position) > this.draggingThreshold
    ) {
      this.lastDraggingPosition = this.mouseDownPosition;
    }

    if (this.lastDraggingPosition) {
      const delta = {
        x: position.x - this.lastDraggingPosition.x,
        y: position.y - this.lastDraggingPosition.y
      };

      this.lastDraggingPosition = position;
      game.onDrag(position, delta);
    }
  }

  onMouseOut(event) {
    const { game } = this.props;
    this.mouseDownPosition = null;
    this.lastDraggingPosition = null;
    game.onMouseOut(event);
  }

  onKeyDown(event) {
    const { game } = this.props;
    game.onKeyDown(event);
  }

  onKeyUp(event) {
    const { game } = this.props;
    game.onKeyUp(event);
  }

  componentDidUpdate() {
    console.log("updated init");
    this.props.game.initRender(this.canvasRef.current);
  }

  shouldComponentUpdate(nextProps, nextState) {
    /*
    if (this.props.game != nextProps.game) {
      this.props.game.deactivate();
      return true;
    }
  */

    return false;
  }

  render() {
    console.log("rerender game scene component");
    return (
      <>
        <ClickCatcher
          ref={this.clickCatcherRef}
          onMouseOut={this.onMouseOut.bind(this)}
          onMouseDown={this.onMouseDown.bind(this)}
          onMouseUp={this.onMouseUp.bind(this)}
          onMouseMove={this.onMouseMove.bind(this)}
          onKeyUp={this.onKeyUp.bind(this)}
          onContextMenu={e => {
            e.preventDefault();
            e.stopPropagation();
          }}
        />
        <WebglCanvas ref={this.canvasRef} />
      </>
    );
  }
}

export default GameSceneComponent;
