import * as React from "react";
import styled from "styled-components";
import GamePositionComponent from "../GamePositionComponent";

const Container = styled.div`
  opacity: 0.85;
`;

const TextContainer = styled.div`
    position: absolute
    color: white;
    font-family: arial;
    margin: 0;
    font-size: 16px;
    text-transform: uppercase;
    height: 20px;
    padding: 2px 0;
    overflow: hidden;
     /* background-color: rgba(0, 0, 0, 0.5); */
    display: flex;
    justify-content: center;
    align-items: center;
    text-shadow: black 0px 0px 13px, black 0px 0px 13px, black 0px 0px 13px;
    cursor: default;
`;

const EnginePower = styled(TextContainer)`
  top: -100px;
  left: -120px;
  width: 240px;
`;

const Evasion = styled(TextContainer)`
  top: 76px;
  left: -180px;
  width: 360px;
  justify-content: space-around;
`;

const Stats = styled(TextContainer)`
  top: -76px;
  left: -120px;
  width: 240px;
  font-size: 14px;
  text-transform: none;
  justify-content: space-around;
  flex-wrap: wrap;
`;

const OverChannel = styled(Stats)`
  top: 52px;
  left: -100px;
  width: 200px;
`;

class Movement extends React.Component {
  render() {
    const {
      ship,
      movementService,
      getPosition,
      uiState,
      children,
      ui = true
    } = this.props;

    return (
      <GamePositionComponent getPosition={getPosition} uiState={uiState}>
        <Container id="shipMovementActual">
          {ui && (
            <>
              <EnginePower>
                {`Engine power: ${ship.movement.getRemainingThrustOutput()} / ${ship.movement.getThrustOutput()}`}
              </EnginePower>
              {/*
        <Stats>
          <div>{`Acceleration cost: ${ship.accelcost}`}</div>
          <div>{`Pivot cost: ${ship.pivotcost}`}</div>
        </Stats>
       */}
              <Evasion>
                <div>{`Over: ${movementService.getOverChannel(ship)}`}</div>
                <div>{`Evasion: ${ship.movement.getEvasion(ship)}`}</div>
                <div>{`Rolling: ${
                  ship.movement.getRollMove() ? "yes" : "no"
                }`}</div>
              </Evasion>
              {/* 
        <OverChannel>
          <div>{`Evasion cost: ${ship.evasioncost}`}</div>
          <div>{`Roll cost: ${ship.rollcost}`}</div>
        </OverChannel>
        */}
            </>
          )}

          {children}
        </Container>
      </GamePositionComponent>
    );
  }
}

export default Movement;
