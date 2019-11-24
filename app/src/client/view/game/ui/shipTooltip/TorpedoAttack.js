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
      launcher.setLaunchTarget(ship);
      this.forceUpdate();
    };
  }

  render() {
    const { uiState, ship } = this.props;

    const torpedoAttackService = new TorpedoAttackService(
      uiState.services,
      uiState.gameData,
      ship
    );

    const launchers = torpedoAttackService.getPossibleTorpedos();

    console.log(launchers);

    return (
      <>
        <TooltipSubHeader>
          <Cell>Name</Cell>
          <Cell>Distance</Cell>
          <Cell>Δ Distance</Cell>
        </TooltipSubHeader>
        {launchers.map((torpedoShipEntry, i) => (
          <Container key={`torpedo-launching-ship-${i}`}>
            <TooltipHeader>
              <Cell>{torpedoShipEntry.ship.name}</Cell>
              <Cell>{torpedoShipEntry.distance}</Cell>
              <Cell>{torpedoShipEntry.deltaDistance}</Cell>
            </TooltipHeader>
            <TorpedoList>
              {torpedoShipEntry.launchers.map((launcher, i) => (
                <TorpedoCargoItem
                  launcher={launcher}
                  ship={ship}
                  handleOnClick={this.launcherClick(launcher).bind(this)}
                  key={`torpedo-attack--torpedo-${torpedoShipEntry.ship.id}-${i}`}
                  cargo={launcher.loadedTorpedo}
                  amount={null}
                />
              ))}
            </TorpedoList>
          </Container>
        ))}
      </>
    );
  }
}

export default TorpedoAttack;
