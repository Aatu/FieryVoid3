import React, { memo, useEffect, useState } from "react";
import styled from "styled-components";
import ShipFleetBadge from "./ShipFleetBadge";
import { useUser } from "../../../../state/userHooks";
import { User } from "@fieryvoid3/model";
import GameData from "@fieryvoid3/model/src/game/GameData";
import { useGameData } from "../../../../state/useGameData";

type ContainerProps = {
  $isRight: boolean;
};

const Container = styled.div<ContainerProps>`
  position: absolute;
  top: 50px;
  ${(props) => (props.$isRight ? "right: 10px;" : "left: 10px;")}

  z-index: 3;
`;

type ShipListActualProps = {
  primary: string[];
  secondary?: string[];
  isRight?: boolean;
};

const ShipListActual: React.FC<ShipListActualProps> = ({
  primary = [],
  isRight = false,
}) => {
  return (
    <Container $isRight={isRight}>
      {primary.map((shipId) => (
        <ShipFleetBadge key={`ship-fleet-list-${shipId}`} shipId={shipId} />
      ))}
    </Container>
  );
};

type ShipListData = {
  myShips: string[];
  alliedShips: string[];
  enemyShips: string[];
};

const selector = (
  user: User | null | undefined,
  gameData: GameData | null
): ShipListData => {
  if (!gameData) {
    return {
      myShips: [],
      alliedShips: [],
      enemyShips: [],
    };
  }

  const myShips = gameData.ships
    .getUsersShips(user || null)
    .filter((ship) => !ship.isDestroyed());

  const alliedShips = gameData.ships
    .getShipsInSameTeam(user || null)
    .filter((ship) => !ship.isDestroyed())
    .filter((ship) => !myShips.includes(ship));

  const enemyShips = gameData.ships
    .getShipsEnemyTeams(user || null)
    .filter((ship) => !ship.isDestroyed());

  return {
    myShips: myShips.map((ship) => ship.id),
    alliedShips: alliedShips.map((ship) => ship.id),
    enemyShips: enemyShips.map((ship) => ship.id),
  };
};

const compareFunction = (a: ShipListData, b: ShipListData): boolean => {
  if (a.myShips.join() !== b.myShips.join()) {
    return false;
  }

  if (a.alliedShips.join() !== b.alliedShips.join()) {
    return false;
  }

  if (a.enemyShips.join() !== b.enemyShips.join()) {
    return false;
  }

  return true;
};

const useShipListData = (user: User | undefined | null, gameData: GameData) => {
  const data = selector(user, gameData);
  const [finalData, setFinalData] = useState<ShipListData>(data);

  useEffect(() => {
    if (!compareFunction(finalData, data)) {
      setFinalData(data);
    }
  }, [data, finalData]);

  return finalData;
};

const ShipList: React.FC = memo(() => {
  const { data: currentUser } = useUser();
  const gameData = useGameData();
  const { myShips, alliedShips, enemyShips } = useShipListData(
    currentUser,
    gameData
  );

  if (!myShips.length && !alliedShips.length && !enemyShips.length) {
    return null;
  }

  return (
    <>
      {myShips.length > 0 && (
        <ShipListActual primary={myShips} secondary={alliedShips} />
      )}
      {myShips.length > 0 && <ShipListActual primary={enemyShips} isRight />}
    </>
  );
});

export default ShipList;
