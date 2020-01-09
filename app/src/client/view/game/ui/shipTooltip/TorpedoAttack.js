import React from "react";
import TorpedoAttackService from "../../../../../model/weapon/TorpedoAttackService.mjs";
import styled from "styled-components";
import {
  Tooltip,
  TooltipHeader,
  TooltipSubHeader,
  TooltipEntry,
  colors,
  IconAndLabel
} from "../../../../styled";
import CargoItem from "../system/SystemStrategyUi/cargo/CargoItem";
import TorpedoAttackTooltip from "./TorpedoAttackTooltip";
import TorpedoMovementService from "../../../../../model/movement/TorpedoMovementService.mjs";
import TorpedoFlight from "../../../../../model/unit/TorpedoFlight.mjs";

const Container = styled.div`
  z-index: 3;
`;

const Cell = styled.div`
  width: 25%;
  display: flex;

  justify-content: center;

  :first-child {
    width: 50%;
    justify-content: flex-start;
  }

  :last-child {
    justify-content: flex-end;
  }
`;

const TorpedoList = styled.div`
  display: flex;
  flex-wrap: wrap;
`;

const TorpedoCargoItem = styled(CargoItem)`
  ${IconAndLabel} {
    ${props => {
      const { launcher, ship } = props;

      if (launcher.launchTarget === ship.id) {
        return "filter: hue-rotate(0deg) brightness(4) grayscale(0);";
      } else if (
        launcher.launchTarget !== null &&
        launcher.launchTarget !== ship.id
      ) {
        return "filter: hue-rotate(0deg) brightness(1) grayscale(0.7);";
      }
    }}
  }
`;

class TorpedoAttack extends React.Component {
  launcherClick(launcher) {
    return () => {
      const { ship } = this.props;
      if (launcher.launchTarget === null || launcher.launchTarget !== ship.id) {
        launcher.setLaunchTarget(ship.id);
      } else if (launcher.launchTarget && launcher.launchTarget === ship.id) {
        launcher.setLaunchTarget(null);
      }

      this.forceUpdate();
    };
  }

  render() {
    const { uiState, ship: target } = this.props;

    const torpedoAttackService = new TorpedoAttackService(
      uiState.services,
      uiState.gameData,
      target
    );

    const launchers = torpedoAttackService.getPossibleTorpedos(
      uiState.services.currentUser,
      target
    );

    const torpedoMovementService = new TorpedoMovementService();

    return (
      <>
        <TooltipSubHeader>
          <Cell>Name</Cell>
          <Cell>Distance</Cell>
          <Cell>Δ Distance</Cell>
        </TooltipSubHeader>
        {launchers.map((torpedoShipEntry, i) => {
          return (
            <Container key={`torpedo-launching-ship-${i}`}>
              <TooltipHeader>
                <Cell>{torpedoShipEntry.ship.name}</Cell>
                <Cell>{torpedoShipEntry.distance}</Cell>
                <Cell>{torpedoShipEntry.deltaDistance}</Cell>
              </TooltipHeader>
              <TorpedoList>
                {torpedoShipEntry.launchers.map((launcher, i) => {
                  const strikePrediction = torpedoMovementService.predictTorpedoHitPositionAndTurn(
                    new TorpedoFlight(launcher.loadedTorpedo)
                      .setPosition(torpedoShipEntry.ship.getPosition())
                      .setVelocity(torpedoShipEntry.ship.getVelocity()),
                    target
                  );

                  if (!strikePrediction) {
                    return null;
                  }

                  return (
                    <TorpedoCargoItem
                      launcher={launcher}
                      ship={torpedoShipEntry.ship}
                      handleOnClick={this.launcherClick(launcher).bind(this)}
                      key={`torpedo-attack--torpedo-${torpedoShipEntry.ship.id}-${i}`}
                      cargo={launcher.loadedTorpedo}
                      amount={null}
                      text={`${Math.round(
                        strikePrediction.effectiveness * 100
                      )}%`}
                      tooltipAdditionalContent={
                        <TorpedoAttackTooltip
                          shooter={torpedoShipEntry.ship}
                          target={target}
                          torpedo={launcher.loadedTorpedo}
                          strikePrediction={strikePrediction}
                        />
                      }
                    />
                  );
                })}
              </TorpedoList>
            </Container>
          );
        })}
      </>
    );
  }
}

export default TorpedoAttack;
