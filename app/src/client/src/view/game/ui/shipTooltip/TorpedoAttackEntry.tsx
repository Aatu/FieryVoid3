import React from "react";
import styled from "styled-components";
import { IconAndLabel } from "../../../../styled";
import CargoItem from "../system/SystemStrategyUi/cargo/CargoItem";
import TorpedoAttackTooltip from "./TorpedoAttackTooltip";
import TorpedoLauncherStrategy from "@fieryvoid3/model/src/unit/system/strategy/weapon/TorpedoLauncherStrategy";
import Ship from "@fieryvoid3/model/src/unit/Ship";
import UIState from "../UIState";
import { useForceRerender } from "../../../../util/useForceRerender";

type TorpedoCargoItemProps = {
  launcher: TorpedoLauncherStrategy;
  target: Ship;
};

const TorpedoCargoItem = styled(CargoItem)<TorpedoCargoItemProps>`
  ${IconAndLabel} {
    ${(props) => {
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

type Props = {
  uiState: UIState;
  launcher: TorpedoLauncherStrategy;
  target: Ship;
  absoluteTooltip?: boolean;
  onLauncherClick?: () => void;
};

const TorpedoAttackEntry: React.FC<Props> = ({
  uiState,
  launcher,
  target,
  onLauncherClick,
  absoluteTooltip = false,
}) => {
  const rerender = useForceRerender();

  const torpedoMouseOut = () =>
    uiState.customEvent("torpedoMouseOut", {
      ship: launcher.getShip(),
      torpedo: launcher.loadedTorpedo,
      target,
    });

  const torpedoMouseOver = () =>
    uiState.customEvent("torpedoMouseOver", {
      ship: launcher.getShip(),
      torpedo: launcher.loadedTorpedo,
      target,
    });

  const launcherClick = () => {
    if (launcher.launchTarget === null || launcher.launchTarget !== target.id) {
      launcher.setLaunchTarget(target.id);
    } else if (launcher.launchTarget && launcher.launchTarget === target.id) {
      launcher.setLaunchTarget(null);
    }

    rerender();
    if (onLauncherClick) onLauncherClick();
  };

  return (
    <TorpedoCargoItem
      launcher={launcher}
      target={target}
      handleOnClick={launcherClick}
      handleMouseOver={torpedoMouseOver}
      handleMouseOut={torpedoMouseOut}
      cargo={launcher.loadedTorpedo!}
      text={``}
      absoluteTooltip={absoluteTooltip}
      tooltipAdditionalContent={<TorpedoAttackTooltip target={target} />}
    />
  );
};

export default TorpedoAttackEntry;
