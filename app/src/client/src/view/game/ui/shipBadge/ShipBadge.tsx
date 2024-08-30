import React, { useMemo, memo } from "react";
import styled from "styled-components";
import GamePositionComponent from "../GamePositionComponent";
import { ShipBadgeUIState } from "../UIState";
import { useGameStore } from "../../GameStoreProvider";
import { useUiStateHandler } from "../../../../state/useUIStateHandler";
import { useShipsBasicState } from "../../../../state/useShipBasicState";
import { useGetShipPosition } from "../../../../state/useGetShipPosition";

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
  $background: string;
};

const Icon = styled.div<IconProps>`
  width: 15px;
  height: 15px;
  background-size: cover;
  background-color: transparent;
  background-image: ${(props) => `url(${props.$background})`};
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

type Props = {
  shipId: string;
  showName: boolean;
  visible: boolean;
};

const ShipBadge: React.FC<Props> = ({ shipId, showName, visible }) => {
  const uiState = useUiStateHandler();

  const { isMine, incomingTorpedos, validPower, shipName } =
    useShipsBasicState(shipId);

  if (!isMine || (incomingTorpedos === 0 && validPower)) {
    visible = false;
  }

  const getPosition = useGetShipPosition(shipId);

  const memoizedComponent = useMemo(
    () =>
      visible && (
        <ShipBadgeContainer>
          <BackgroundContainer>
            {showName && <ShipName>{shipName}</ShipName>}

            <Badges>
              {isMine && incomingTorpedos > 0 && (
                <WarningBadge>
                  <Icon $background="/img/system/missile1.png" />
                  {incomingTorpedos}
                </WarningBadge>
              )}

              {isMine && !validPower && (
                <WarningBadge>
                  <Icon $background="/img/offline.png" />
                </WarningBadge>
              )}
            </Badges>
          </BackgroundContainer>
        </ShipBadgeContainer>
      ),
    [visible, showName, shipName, isMine, incomingTorpedos, validPower]
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

const compareFunction = (
  listA: ShipBadgeUIState[],
  listB: ShipBadgeUIState[]
): boolean => {
  if (listA.length !== listB.length) {
    return false;
  }

  return listA.every((a) => {
    const b = listB.find((b) => b.icon.ship.id === a.icon.ship.id);
    if (!b) {
      return false;
    }

    if (a.visible !== b.visible) {
      return false;
    }

    if (a.showName !== b.showName) {
      return false;
    }

    return true;
  });
};
export const ShipBadges: React.FC = memo(() => {
  const badges = useGameStore((state) => {
    return [...state.gameState.shipBadges];
  }, compareFunction);

  return useMemo(
    () => (
      <>
        {badges.map(({ icon, visible, showName }) => (
          <ShipBadge
            key={`ship-badge-${icon.ship.id}`}
            shipId={icon.ship.id}
            visible={visible}
            showName={showName}
          />
        ))}
      </>
    ),
    [badges]
  );
});

export default ShipBadge;
