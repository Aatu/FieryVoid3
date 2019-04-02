import * as React from "react";
import styled from "styled-components";

const WebglCanvas = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
`;

class GameSceneComponent extends React.Component {
  constructor(props) {
    super(props);
    // create a ref to store the textInput DOM element
    this.canvasRef = React.createRef();
    this.mouseDownTimeStamp = null;
    this.dragging = false;
    this.draggingThreshold = 1000;
  }

  componentDidMount() {
    const { game } = this.props;

    window.addEventListener("resize", this.onResize);
    document.addEventListener("keydown", this.onKeyDown.bind(this), false);
    document.addEventListener("keyup", this.onKeyUp.bind(this), false);
    game.initRender(this.canvasRef.current);
  }

  componentWillUnmount() {
    document.removeEventListener("keydown", this.onKeyDown.bind(this), false);
    document.removeEventListener("keyup", this.onKeyUp.bind(this), false);
    window.removeEventListener("resize", this.onResize);
  }

  onResize = () => {
    const { game } = this.props;
    game.camera.onResize();
  };

  onMouseDown(event) {
    console.log("onMouseDown");
    this.mouseDownTimeStamp = new Date().getTime();
  }

  onMouseUp(event) {
    console.log("onMouseUp");
    this.mouseDownTimeStamp = null;
    this.dragging = false;
  }

  onMouseMove(event) {
    if (this.mouseDownTimeStamp === null) {
      return;
    }

    if (
      this.dragging === false &&
      new Date().getTime() - this.mouseDownTimeStamp >= this.draggingThreshold
    ) {
      this.dragging = true;
    }
  }

  onKeyDown(event) {
    const { game } = this.props;
    game.camera.onKeyDown(event);
  }

  onKeyUp(event) {
    const { game } = this.props;
    game.camera.onKeyUp(event);
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
