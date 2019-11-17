import React from "react";
import styled from "styled-components";
import { InfoHeader } from "../../SystemInfo";
import { IconAndLabel } from "../../../../../../styled";
import CargoItem from "./CargoItem";

const CargoListContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
`;

class CargoList extends React.Component {
  onSystemMouseOver(event) {
    event.stopPropagation();
    event.preventDefault();

    let { uiState, system, ship } = this.props;

    uiState.customEvent("systemMouseOver", {
      ship,
      system,
      element: this.element
    });

    this.setState({ mouseOveredSystem: this.element });
  }

  onSystemMouseOut(event) {
    event.stopPropagation();
    event.preventDefault();

    let { uiState } = this.props;

    uiState.customEvent("systemMouseOut");

    this.setState({ mouseOveredSystem: null });
  }

  render() {
    const { list } = this.props;

    return (
      <>
        <InfoHeader>Current cargo</InfoHeader>
        <CargoListContainer>
          {list.map(({ cargo, amount }, i) => (
            <CargoItem key={`cargo-item-${i}`} cargo={cargo} amount={amount} />
          ))}
        </CargoListContainer>
      </>
    );
  }
}

export default CargoList;
