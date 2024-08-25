import React from "react";

import Slot from "./Slot";

import { Title, DarkContainer } from "../../styled";
import styled from "styled-components";
import { useGameData } from "../../state/useGameData";

const Container = styled.div`
  margin: 0 8px 8px 8px;
`;

const Slots: React.FC = () => {
  const gameData = useGameData();

  const mapTeamsToComponents = () => {
    return gameData.slots.getSlotsByTeams().map((team) => {
      return (
        <Container>
          <DarkContainer key={`team-${team.team}`}>
            <Title>TEAM: {team.team}</Title>
            {team.slots.map((slot) => (
              <Slot key={slot.id} slot={slot} />
            ))}
          </DarkContainer>
        </Container>
      );
    });
  };

  return <>{mapTeamsToComponents()}</>;
};

export default Slots;
