import React, { useMemo, useCallback } from "react";
import styled from "styled-components";
import GamePositionComponent from "../GamePositionComponent";
import { Tooltip, IconAndLabel } from "../../../../styled";
import TorpedoMovementService from "../../../../../model/movement/TorpedoMovementService.mjs";
import GameData from "../../../../../model/game/GameData.mjs";
import coordinateConverter from "../../../../../model/utils/CoordinateConverter.mjs";

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

const DewBadge = styled(IconAndLabel)`
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  margin: 0 1px;
`;

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

const Icon = styled.div`
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

const getNumberOfMissilesImpacting = (ship, gameData) => {
  const gameDataObject = new GameData(gameData);

  return gameDataObject.torpedos
    .getTorpedoFlights()
    .filter((flight) => flight.targetId === ship.id).length;
};

const ShipBadge = ({ icon, uiState, showName, visible }) => {
  const { currentUser } = uiState.services;
  const isMine = icon.ship.player.is(currentUser);

  const getPosition = () =>
    coordinateConverter.fromGameToViewPort(icon.getPosition());

  const missiles = getNumberOfMissilesImpacting(
    icon.ship,
    uiState.state.gameData
  );

  const validPower = icon.ship.systems.power.isValidPower();

  if (!isMine || (missiles === 0 && validPower)) {
    visible = false;
  }

  const memoizedComponent = useMemo(
    () =>
      visible && (
        <ShipBadgeContainer>
          <BackgroundContainer>
            {false && showName && <ShipName>{icon.ship.name}</ShipName>}

            <Badges>
              {isMine && missiles > 0 && (
                <WarningBadge>
                  <Icon background="/img/system/missile1.png" />
                  {missiles}
                </WarningBadge>
              )}

              {isMine && !icon.ship.systems.power.isValidPower() && (
                <WarningBadge>
                  <Icon background="/img/offline.png" />
                </WarningBadge>
              )}
            </Badges>
          </BackgroundContainer>
        </ShipBadgeContainer>
      ),
    [visible, isMine, missiles, validPower]
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
