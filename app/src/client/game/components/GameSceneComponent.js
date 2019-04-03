import * as React from "react";
import styled from "styled-components";
import { distance } from "../../../model/utils/math";

const WebglCanvas = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  background-image: url(/img/space-picture.jpg);
  background-size: cover;
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
    this.mouseDownPosition = null;
    this.lastDraggingPosition = null;
    this.draggingThreshold = 5;
  }

  componentDidMount() {
    const { game } = this.props;

    window.addEventListener("resize", this.onResize);
    window.addEventListener("wheel", this.onWheel);
    document.addEventListener("keydown", this.onKeyDown.bind(this), false);
    document.addEventListener("keyup", this.onKeyUp.bind(this), false);

    game.initRender(this.canvasRef.current);
  }

  componentWillUnmount() {
    document.removeEventListener("keydown", this.onKeyDown.bind(this), false);
    document.removeEventListener("keyup", this.onKeyUp.bind(this), false);
    window.removeEventListener("resize", this.onResize);
    window.removeEventListener("wheel", this.onWheel);
  }

  onWheel = event => {
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
      this.canvasRef.current
    );
  }

  onMouseUp(event) {
    event.stopPropagation();
    event.preventDefault();

    const { game } = this.props;
    if (!this.lastDraggingPosition) {
      game.onMouseUp(
        getMousePositionInObservedElement(event, this.canvasRef.current)
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
      return;
    }

    const position = getMousePositionInObservedElement(
      event,
      this.canvasRef.current
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

  onKeyDown(event) {
    const { game } = this.props;
    game.onKeyDown(event);
  }

  onKeyUp(event) {
    const { game } = this.props;
    game.onKeyUp(event);
  }

  render() {
    console.log("Render game scene container");
    return (
      <WebglCanvas
        ref={this.canvasRef}
        onMouseDown={this.onMouseDown.bind(this)}
        onMouseUp={this.onMouseUp.bind(this)}
        onMouseMove={this.onMouseMove.bind(this)}
        onKeyUp={this.onKeyUp.bind(this)}
      />
    );
  }
}

export default GameSceneComponent;
