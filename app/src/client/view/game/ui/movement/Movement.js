import * as React from "react";
import styled, { css } from "styled-components";

const Container = styled.div`
  position: absolute;
  left: 50%;
  bottom: 125px;
  opacity: 0.85;
  user-select: none;
  z-index: 3;
`;

const Text = css`
  color: white;
  font-family: arial;
  font-size: 16px;
  text-transform: uppercase;
`;

const TextContainer = styled.div`
  ${Text}
  position: absolute;
  width: 600px;
  left: calc(50% - 300px);
  bottom: 0;
  padding: 2px 0;
  /* background-color: rgba(0, 0, 0, 0.5); */
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-shadow: black 0px 0px 13px, black 0px 0px 13px, black 0px 0px 13px;
  cursor: default;
`;

const Power = styled.div`
  ${Text}
  font-size: 36px;
  font-weight: bold;
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  width: 50px;
  height: 60px;
  left: -25px;
  bottom: -30px;
`;

const TextRow = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  margin: 5px 0 0 0;

  div {
    padding: 0 5px;
    white-space: nowrap;
  }
`;

const TextRowSmall = styled(TextRow)`
  font-size: 14px;
  text-transform: none;
`;

class Movement extends React.Component {
  render() {
    const { ship, movementService, children, ui = true } = this.props;

    return (
      <>
        <Container id="shipMovementActual">
          {children}
          {ui && <Power>{ship.movement.getRemainingThrustOutput()}</Power>}
        </Container>
      </>
    );
  }
}

export default Movement;
