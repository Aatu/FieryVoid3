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
    const { handleMouseOver = () => {} } = this.props;
    event.stopPropagation();
    event.preventDefault();
    this.setState({ mouseOveredCargo: this.element });
    handleMouseOver();
  }

  onCargoMouseOut(event) {
    const { handleMouseOut = () => {} } = this.props;
    event.stopPropagation();
    event.preventDefault();
    this.setState({ mouseOveredCargo: null });
    handleMouseOut();
  }

  render() {
    const {
      cargo,
      amount,
      handleOnClick = () => {},
      tooltipAdditionalContent,
      text,
      absoluteTooltip,
      ...rest
    } = this.props;
    const { mouseOveredCargo } = this.state;

    return (
      <>
        {absoluteTooltip && mouseOveredCargo && (
          <CargoTooltip
            absoluteTooltip={absoluteTooltip}
            element={mouseOveredCargo}
            cargo={cargo}
            additionalContent={tooltipAdditionalContent}
          />
        )}
        <Container
          onClick={handleOnClick}
          onMouseOver={this.onCargoMouseOver.bind(this)}
          onMouseOut={this.onCargoMouseOut.bind(this)}
          {...rest}
        >
          {!absoluteTooltip && mouseOveredCargo && (
            <CargoTooltip
              absoluteTooltip={absoluteTooltip}
              element={mouseOveredCargo}
              cargo={cargo}
              additionalContent={tooltipAdditionalContent}
            />
          )}
          <IconAndLabel
            ref={c => (this.element = c)}
            background={cargo.getBackgroundImage()}
          >
            {text ? text : amount}
          </IconAndLabel>
        </Container>
      </>
    );
  }
}

export default CargoItem;
