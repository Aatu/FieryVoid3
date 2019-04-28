import React, { Component } from "react";
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
  colors
} from "../../styled";

const selected = css`
  box-shadow: 0px 0px 3px 3px rgba(222, 235, 255, 0.5);
  color: #0a3340;
  background-color: ${colors.border};
  border-color: ${colors.blue};
`;

const SlotContainer = styled(Container)`
  ${props => (props.selected ? selected : "")}
`;

class Slot extends Component {
  handleChange() {}

  getPlayerName(slot) {
    const { gameData } = this.props;

    const user = gameData.players.find(user => user.id === slot.userId);
    return user.username;
  }

  leaveSlot(slot) {
    return () => {
      const { uiState } = this.props;
      uiState.customEvent("leaveSlot", slot);
    };
  }

  takeSlot(slot) {
    return () => {
      const { uiState } = this.props;
      uiState.customEvent("takeSlot", slot);
    };
  }

  render() {
    const {
      slot,
      edit,
      take,
      currentUser,
      selectedSlot,
      children
    } = this.props;

    return (
      <SlotContainer selected={selectedSlot.id === slot.id}>
        <Section>
          {edit ? (
            <>
              <InputAndLabel
                label="Slot name"
                id={`slotName-${slot.name}`}
                placeholder="slot name"
                value={slot.name}
                onChange={this.handleChange}
                error={!slot.name ? "Name is required" : false}
              />

              <InputAndLabel
                label="Points"
                id={`slotPoints-${slot.name}`}
                placeholder="5000"
                value={slot.points}
                onChange={this.handleChange}
                error={
                  slot.points !== parseInt(slot.points, 10) || slot.points <= 0
                    ? "Points must be a positive number"
                    : false
                }
              />
            </>
          ) : (
            <>
              <Title>{slot.name}</Title>
              <Title>
                Points: <Value>{slot.points}</Value>
              </Title>
              <SectionRight>
                {slot.isTaken() && (
                  <Title>
                    Player: <Value>{this.getPlayerName(slot)}</Value>
                  </Title>
                )}
                {currentUser && !slot.isTaken() && take && (
                  <Button
                    onClick={this.takeSlot(slot)}
                    type="button"
                    buttonStyle="button-grey"
                  >
                    Take slot
                  </Button>
                )}
                {take && currentUser && slot.isOccupiedBy(currentUser) && (
                  <Button
                    onClick={this.leaveSlot(slot)}
                    type="button"
                    icon={icons.X}
                  />
                )}
              </SectionRight>
            </>
          )}
        </Section>

        <Section>
          {edit ? (
            <>
              <InputAndLabel
                label="Deployment position (X,Y):"
                id={`deploymentPosition-${slot.name}`}
                placeholder="0"
                value={`${slot.deploymentLocation.q},${
                  slot.deploymentLocation.r
                }`}
                onChange={this.handleChange}
              />

              <InputAndLabel
                label="Deployment vector (X,Y):"
                id={`deploymentVector-${slot.name}`}
                placeholder="0"
                value={`${slot.deploymentVector.q},${slot.deploymentVector.r}`}
                onChange={this.handleChange}
              />
            </>
          ) : (
            <>
              <Label>
                Deployment position:
                <Value>{` ${slot.deploymentLocation.q},${
                  slot.deploymentLocation.r
                }`}</Value>
              </Label>
              <Label>
                Deployment vector:
                <Value>{`${slot.deploymentVector.q},${
                  slot.deploymentVector.r
                }`}</Value>
              </Label>
              <Label>
                Deployment radius: <Value> {slot.deploymentRadius}</Value>
              </Label>
            </>
          )}
        </Section>

        <Section>
          {edit && (
            <InputAndLabel
              label="Deployment radius:"
              id={`deploymentRadius-${slot.name}`}
              placeholder="0"
              value={slot.deploymentRadius}
              onChange={this.handleChange}
            />
          )}
        </Section>
        {children}
      </SlotContainer>
    );
  }
}

export default Slot;
