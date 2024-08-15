import * as React from "react";
import styled from "styled-components";

const Container = styled.div`
  position: absolute;
  top: 0px;
  left: 0px;
`;

class GamePositionComponent extends React.Component {
  constructor(props) {
    super(props);

    this.containerRef = React.createRef();
    this.renderCallback = this.onGameRender.bind(this);
    this.position = null;
    this.state = {
      position: null
    };
  }

  onGameRender() {
    const { getPosition, marginTop = 0, marginLeft = 0 } = this.props;

    if (!this.containerRef.current) {
      return;
    }

    const newPosition = getPosition();

    if (
      !this.position ||
      this.position.x !== newPosition.x ||
      this.position.y !== newPosition.y
    ) {
      this.position = newPosition;

      this.containerRef.current.style.left = `${newPosition.x + marginLeft}px`;
      this.containerRef.current.style.top = `${newPosition.y + marginTop}px`;
    }
  }

  componentDidMount() {
    const { uiState } = this.props;

    uiState.subscribeToRender(this.renderCallback);
  }

  componentWillUnmount() {
    const { uiState } = this.props;

    uiState.unsubscribeFromRender(this.renderCallback);
  }

  render() {
    const { children } = this.props;

    /*
    style={{
          top: position.y + marginTop + "px",
          left: position.x + marginLeft + "px"
        }}
        */

    return <Container ref={this.containerRef}>{children}</Container>;
  }
}

export default GamePositionComponent;
