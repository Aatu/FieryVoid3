import React, { Component } from "react";

import {
  Title,
  InputAndLabel,
  Container,
  Section,
  Label,
  Value,
  SectionRight,
  Button
} from "../../styled";

class Slot extends Component {
  handleChange() {}

  getPlayerName(slot) {
    const { gameData } = this.props;

    console.log(slot.userId, gameData.players);
    const user = gameData.players.find(user => user.id === slot.userId);
    return user.username;
  }

  takeSlot(slot) {
    return () => {
      const { game } = this.props;
      game.customEvent("takeSlot", slot);
    };
  }
  render() {
    const { slot, edit, take } = this.props;
    return (
      <Container>
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
                {slot.isTaken() && take ? (
                  <Title>
                    Player: <Value>{this.getPlayerName(slot)}</Value>
                  </Title>
                ) : (
                  <Button
                    onClick={this.takeSlot(slot)}
                    type="button"
                    buttonStyle="button-grey"
                  >
                    Take slot
                  </Button>
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
      </Container>
    );
  }
}

export default Slot;
