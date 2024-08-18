import * as React from "react";
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

class HomeSceneComponent extends React.Component {
  private canvasRef: React.RefObject<HTMLDivElement>;
  private scene: HomeScene;

  constructor() {
    super({});
    this.canvasRef = React.createRef();
    this.scene = new HomeScene();
  }

  componentDidMount() {
    window.addEventListener("resize", this.onResize.bind(this));

    const sceneElement = this.canvasRef.current;

    this.scene.init(sceneElement, this.getDimensions());
  }

  getDimensions() {
    return {
      width: this.canvasRef.current?.offsetWidth,
      height: this.canvasRef.current?.offsetHeight,
    };
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.onResize.bind(this));
  }

  onResize() {
    if (!this.canvasRef.current) {
      return;
    }

    const dimensions = this.getDimensions();
    this.scene.onResize(dimensions);
  }

  shouldComponentUpdate() {
    return false;
  }

  render() {
    return <WebglCanvas ref={this.canvasRef} />;
  }
}

export default HomeSceneComponent;
