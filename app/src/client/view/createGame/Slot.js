import React, { Component } from "react";
import { connect } from "react-redux";
import styled, { css } from "styled-components";
import GameData from "../../../model/game/GameData";
import GameSlot from "../../../model/game/GameSlot";
import hexagon from "../../../model/hexagon";
import * as Yup from "yup";

import {
  Title,
  InputAndLabel,
  Container,
  PanelContainer,
  Button,
  Error,
  Link,
  DarkContainer,
  Section
} from "../../styled";

class Slot extends Component {
  handleChange() {}

  render() {
    const { slot, edit } = this.props;
    console.log(
      slot.points,
      parseInt(slot.points, 10),
      slot.points === parseInt(slot.points, 10)
    );
    return (
      <Container>
        <Section>
          {edit ? (
            <InputAndLabel
              label="Slot name"
              id={`slotName-${slot.name}`}
              placeholder="slot name"
              value={slot.name}
              onChange={this.handleChange}
              error={!slot.name ? "Name is required" : false}
            />
          ) : (
            <Title>{slot.name}</Title>
          )}

          {edit ? (
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
          ) : (
            <Title>Points: {slot.points}</Title>
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
            <p>
              Deployment position:
              {`${slot.deploymentLocation.q},${slot.deploymentLocation.r}`}
              Deployment vector:{" "}
              {`${slot.deploymentVector.q},${slot.deploymentVector.r}`}
            </p>
          )}
        </Section>

        <Section>
          {edit ? (
            <InputAndLabel
              label="Deployment radius:"
              id={`deploymentRadius-${slot.name}`}
              placeholder="0"
              value={slot.deploymentRadius}
              onChange={this.handleChange}
            />
          ) : (
            <p>Deployment radius: {slot.deploymentRadius}</p>
          )}
        </Section>
      </Container>
    );
  }
}

export default Slot;
