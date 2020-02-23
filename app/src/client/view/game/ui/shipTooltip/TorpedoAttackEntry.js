import React from "react";
import styled from "styled-components";
import { IconAndLabel } from "../../../../styled";
import CargoItem from "../system/SystemStrategyUi/cargo/CargoItem";
import TorpedoAttackTooltip from "./TorpedoAttackTooltip";

const TorpedoCargoItem = styled(CargoItem)`
  ${IconAndLabel} {
    ${props => {
      const { launcher, target } = props;

      if (launcher.launchTarget === target.id) {
        return "filter: hue-rotate(0deg) brightness(4) grayscale(0);";
      } else if (
        launcher.launchTarget !== null &&
        launcher.launchTarget !== target.id
      ) {
        return "filter: hue-rotate(0deg) brightness(1) grayscale(0.7);";
      }
    }}
  }
`;

class TorpedoAttackEntry extends React.Component {
  torpedoMouseOut() {
    const { uiState, launcher, target } = this.props;

    uiState.customEvent("torpedoMouseOut", {
      ship: launcher.system.shipSystems.ship,
      torpedo: launcher.loadedTorpedo,
      target
    });
  }

  torpedoMouseOver() {
    const { uiState, launcher, target } = this.props;

    uiState.customEvent("torpedoMouseOver", {
      ship: launcher.system.shipSystems.ship,
      torpedo: launcher.loadedTorpedo,
      target
    });
  }

  launcherClick() {
    const { target, launcher, onLauncherClick = () => {} } = this.props;

    if (launcher.launchTarget === null || launcher.launchTarget !== target.id) {
      launcher.setLaunchTarget(target.id);
    } else if (launcher.launchTarget && launcher.launchTarget === target.id) {
      launcher.setLaunchTarget(null);
    }

    this.forceUpdate();
    onLauncherClick();
  }

  render() {
    const { target, launcher, absoluteTooltip } = this.props;

    return (
      <TorpedoCargoItem
        launcher={launcher}
        target={target}
        ship={launcher.system.shipSystems.ship}
        handleOnClick={this.launcherClick.bind(this)}
        handleMouseOver={this.torpedoMouseOver.bind(this)}
        handleMouseOut={this.torpedoMouseOut.bind(this)}
        cargo={launcher.loadedTorpedo}
        amount={null}
        text={``}
        absoluteTooltip={absoluteTooltip}
        tooltipAdditionalContent={
          <TorpedoAttackTooltip
            shooter={launcher.system.shipSystems.ship}
            target={target}
            torpedo={launcher.loadedTorpedo}
          />
        }
      />
    );
  }
}

export default TorpedoAttackEntry;
