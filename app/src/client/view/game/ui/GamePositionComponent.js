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

    this.renderCallback = this.onGameRender.bind(this);
    this.state = {
      position: null
    };
  }

  onGameRender() {
    const { getPosition } = this.props;
    const { position } = this.state;

    const newPosition = getPosition();

    if (
      !position ||
      position.x !== newPosition.x ||
      position.y !== newPosition.y
    ) {
      this.setState({ position: newPosition });
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
    const { position } = this.state;

    if (!position) {
      return null;
    }

    return (
      <Container
        style={{
          top: position.y + "px",
          left: position.x + "px"
        }}
      >
        {children}
      </Container>
    );
  }
}

export default GamePositionComponent;
