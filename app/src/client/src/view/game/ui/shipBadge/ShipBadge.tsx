import React, { useMemo, useCallback } from "react";
import styled from "styled-components";
import GamePositionComponent from "../GamePositionComponent";
import UIState from "../UIState";
import ShipObject from "../../renderer/ships/ShipObject";
import { useUser } from "../../../../state/userHooks";
import Ship from "@fieryvoid3/model/src/unit/Ship";
import GameData from "@fieryvoid3/model/src/game/GameData";
import coordinateConverter from "@fieryvoid3/model/src/utils/CoordinateConverter";

const ShipBadgeContainer = styled.div`
  text-align: left;
  position: relative;
  z-index: 0;
  display: flex;
  flex-direction: row;
  color: white;
  font-family: arial;
  margin-left: -50%;
  font-size: 12px;
`;

/*
const DewBadge = styled(IconAndLabel)`
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  margin: 0 1px;
`;
*/

const ShipName = styled.div`
  /* background-color: rgba(0, 0, 0, 0.5);
  padding: 3px 5px; */
  margin-right: 5px;
`;

const BackgroundContainer = styled.div`
  display: flex;
  flex-direction: row;
  background-color: rgba(0, 0, 0, 0.5);
  align-items: center;
  padding: 3px 5px;
`;

type IconProps = {
  background: string;
};

const Icon = styled.div<IconProps>`
  width: 15px;
  height: 15px;
  background-size: cover;
  background-color: transparent;
  background-image: ${(props) => `url(${props.background})`};
  margin: 0 3px 0 0;
`;

const BadgeIconAndLabel = styled.div`
  display: flex;
  height: 100%;
  align-items: center;
`;

const BadgeIcon = styled(BadgeIconAndLabel)`
  ${Icon} {
    margin: 0;
  }
`;

const Badges = styled.div`
  display: flex;
  hieght: 100%;

  ${BadgeIconAndLabel} {
    margin-left: 5px;

    &:first-child {
      margin-left: 0px;
    }
  }
`;

const WarningBadge = styled(BadgeIcon)`
  animation: blinker 1s linear infinite;

  @keyframes blinker {
    50% {
      opacity: 0;
    }
  }
`;

const getNumberOfMissilesImpacting = (ship: Ship, gameData: GameData) => {
  const gameDataObject = new GameData(gameData.serialize());

  return gameDataObject.torpedos
    .getTorpedoFlights()
    .filter((flight) => flight.targetId === ship.id).length;
};

type Props = {
  shipObject: ShipObject;
  uiState: UIState;
  showName: boolean;
  visible: boolean;
};

const ShipBadge: React.FC<Props> = ({
  shipObject,
  uiState,
  showName,
  visible,
}) => {
  const { data: currentUser } = useUser();
  const isMine = shipObject.ship.player.is(currentUser || null);

  const getPosition = useCallback(
    () => coordinateConverter.fromGameToViewPort(shipObject.getPosition()),
    [shipObject]
  );

  const missiles = getNumberOfMissilesImpacting(
    shipObject.ship,
    uiState.getGameData()
  );

  const shipName = shipObject.ship.name;
  const validPower = shipObject.ship.systems.power.isValidPower();

  if (!isMine || (missiles === 0 && validPower)) {
    visible = false;
  }

  const memoizedComponent = useMemo(
    () =>
      visible && (
        <ShipBadgeContainer>
          <BackgroundContainer>
            {showName && <ShipName>{shipName}</ShipName>}

            <Badges>
              {isMine && missiles > 0 && (
                <WarningBadge>
                  <Icon background="/img/system/missile1.png" />
                  {missiles}
                </WarningBadge>
              )}

              {isMine && !validPower && (
                <WarningBadge>
                  <Icon background="/img/offline.png" />
                </WarningBadge>
              )}
            </Badges>
          </BackgroundContainer>
        </ShipBadgeContainer>
      ),
    [visible, showName, shipName, isMine, missiles, validPower]
  );

  return (
    <GamePositionComponent
      getPosition={getPosition}
      uiState={uiState}
      marginTop={0}
      marginLeft={0}
    >
      {memoizedComponent}
    </GamePositionComponent>
  );
};

export default ShipBadge;
