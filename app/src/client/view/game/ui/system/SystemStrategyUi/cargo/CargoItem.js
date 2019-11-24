import React from "react";
import styled from "styled-components";
import { IconAndLabel } from "../../../../../../styled";
import CargoTooltip from "./CargoTooltip";

const Container = styled.div`
  position: relative;
  margin: 0;
  padding: 0;
  ${props => props.onClick && "cursor: pointer;"}
`;

class CargoItem extends React.Component {
  constructor(props) {
    super(props);

    this.element = React.createRef();
    this.state = {
      mouseOveredCargo: null
    };
  }

  onCargoMouseOver(event) {
    event.stopPropagation();
    event.preventDefault();
    this.setState({ mouseOveredCargo: this.element });
  }

  onCargoMouseOut(event) {
    event.stopPropagation();
    event.preventDefault();
    this.setState({ mouseOveredCargo: null });
  }

  render() {
    const { cargo, amount, handleOnClick = () => {}, ...rest } = this.props;
    const { mouseOveredCargo } = this.state;
    return (
      <Container
        onClick={handleOnClick}
        onMouseOver={this.onCargoMouseOver.bind(this)}
        onMouseOut={this.onCargoMouseOut.bind(this)}
        {...rest}
      >
        {mouseOveredCargo && (
          <CargoTooltip element={mouseOveredCargo} cargo={cargo} />
        )}
        <IconAndLabel
          ref={c => (this.element = c)}
          background={cargo.getBackgroundImage()}
        >
          {amount}
        </IconAndLabel>
      </Container>
    );
  }
}

export default CargoItem;
