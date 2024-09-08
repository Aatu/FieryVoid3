import React from "react";
import styled, { css } from "styled-components";

import {
  Title,
  InputAndLabel,
  Container,
  Section,
  Label,
  Value,
  SectionRight,
  Button,
  icons,
  colors,
  TooltipHeader,
  TooltipValue,
  TooltipEntry,
  TooltipValueHeader,
  TooltipContainer,
  TooltipBuilder,
} from "../../styled";
import GameSlot from "@fieryvoid3/model/src/game/GameSlot";
import { useUser } from "../../state/userHooks";
import { useGameData } from "../../state/useGameData";
import { useUiStateHandler } from "../../state/useUIStateHandler";

const selected = css`
  box-shadow: 0px 0px 3px 3px rgba(222, 235, 255, 0.5);
  color: #0a3340;
  background-color: ${colors.border};
  border-color: ${colors.blue};
`;

type SlotContainerProps = {
  selected: boolean;
};

const SlotContainer = styled(TooltipContainer)<SlotContainerProps>`
  ${(props) => (props.selected ? selected : "")}

  padding: 6px;
  width: 100%;
`;

type Props = {
  slot: GameSlot;
  edit?: boolean;
  take?: boolean;
  selectedSlot?: GameSlot;
  children?: React.ReactNode;
};

const Slot: React.FC<Props> = ({
  slot,
  edit = false,
  take = false,
  selectedSlot,
  children,
}) => {
  const { data: currentUser } = useUser();
  const gameData = useGameData();
  const uiState = useUiStateHandler();

  const getPlayerName = (slot: GameSlot) => {
    const user = gameData.players.find((user) => user.id === slot.userId);
    return user?.username;
  };

  const leaveSlot = (slot: GameSlot) => {
    return () => {
      uiState.customEvent("leaveSlot", { slot });
    };
  };

  const takeSlot = (slot: GameSlot) => {
    return () => {
      uiState.customEvent("takeSlot", { slot });
    };
  };

  return (
    <SlotContainer
      selected={Boolean(selectedSlot && selectedSlot.id === slot.id)}
    >
      <Section>
        {edit ? (
          <>
            <InputAndLabel
              label="Slot name"
              id={`slotName-${slot.name}`}
              placeholder="slot name"
              value={slot.name}
              onChange={() => console.log("Not implemented")}
              error={!slot.name ? "Name is required" : undefined}
            />

            <InputAndLabel
              label="Points"
              id={`slotPoints-${slot.name}`}
              placeholder="5000"
              value={slot.points}
              onChange={() => console.log("Not implemented")}
              error={
                slot.points !== slot.points || slot.points <= 0
                  ? "Points must be a positive number"
                  : undefined
              }
            />
          </>
        ) : (
          <>
            <TooltipHeader>{slot.name}</TooltipHeader>

            <SectionRight>
              {slot.isTaken() && (
                <Title>
                  Player: <Value>{getPlayerName(slot)}</Value>
                </Title>
              )}
              {currentUser && !slot.isTaken() && take && (
                <Button
                  onClick={takeSlot(slot)}
                  type="button"
                  buttonstyle="button-grey"
                >
                  Take slot
                </Button>
              )}
              {take && currentUser && slot.isOccupiedBy(currentUser) && (
                <Button
                  onClick={leaveSlot(slot)}
                  type="button"
                  IconComponent={icons.X}
                />
              )}
            </SectionRight>
          </>
        )}
      </Section>

      <Section>
        <TooltipBuilder
          entries={[{ value: [{ header: "Points", value: slot.points }] }]}
        />

        {edit ? (
          <>
            <InputAndLabel
              label="Deployment position (X,Y):"
              id={`deploymentPosition-${slot.name}`}
              placeholder="0"
              value={`${slot.deploymentLocation.q},${slot.deploymentLocation.r}`}
              onChange={() => console.log("Not implemented")}
            />

            <InputAndLabel
              label="Deployment vector (X,Y):"
              id={`deploymentVector-${slot.name}`}
              placeholder="0"
              value={`${slot.deploymentVector.q},${slot.deploymentVector.r}`}
              onChange={() => console.log("Not implemented")}
            />
          </>
        ) : null}
      </Section>

      <Section>
        {edit && (
          <InputAndLabel
            label="Deployment radius:"
            id={`deploymentRadius-${slot.name}`}
            placeholder="0"
            value={slot.deploymentRadius}
            onChange={() => console.log("Not implemented")}
          />
        )}
      </Section>
      {children}
    </SlotContainer>
  );
};

export default Slot;
