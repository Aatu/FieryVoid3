import * as React from "react";
import styled from "styled-components";

import { Clickable } from "../../../../styled";
import ShipSection from "./ShipSection";
import ShipWindowEw from "./ShipWindowEw";
import Draggable from "react-draggable";

const ShipWindowContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  position: absolute;
  ${props => {
    if (props.team === 1) {
      return "left: 50px; \n top: 50px;";
    } else {
      return "right: 50px; \n top: 50px;";
    }
  }}
  max-width: 400px;
  height: auto;
  border: 1px solid #496791;
  background-color: #0a3340;
  opacity: 0.95;
  z-index: 10001;
  box-shadow: 5px 5px 10px black;
  font-size: 10px;
  color: white;
  font-family: arial;

  @media (max-width: 1024px) {
    ${props => {
      if (props.team === 1) {
        return "left: 0; \n top: 0; \n right: unset;";
      } else {
        return "right: 0; \n top: 0; \n left: unset;";
      }
    }}
    max-height: 100vh;
    overflow-y: scroll;
  }
`;

const Header = styled.div`
  background-color: #04161c;
  border-bottom: 1px solid #496791;
  height: 24px;
  display: flex;
  align-items: center;
  padding: 0 5px;
  width: calc(100% - 10px);
  flex-shrink: 0;

  span {
    font-size: 14px;
    padding-right: 10px;
  }
`;

const CloseButton = styled.div`
  width: 25px;
  height: 25px;
  position: absolute;
  right: 0;
  top: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 22px;
  padding-left: 5px;
  margin-top: -2px;
  color: #496791;
  ${Clickable}
`;

const Column = styled.div`
  width: 100%;
  max-height: calc(33.3333333% - 11px);
  display: flex;
  flex-direction: row;
  justify-content: ${props => (props.top ? "space-between" : "center")};
`;

const ShipImage = styled.div`
  width: 114px;
  height: 114px;
  background-color: black;
  background-image: ${props => `url(${props.img})`};
  background-size: 85%;
  background-repeat: no-repeat;
  background-position: center;
  border: 1px solid #496791;
  box-sizing: border-box;
  margin: 2px;
  transform: rotate(-90deg);
`;

class ShipWindow extends React.Component {
  onShipMouseOver(event) {
    let { ship, uiState } = this.props;

    uiState.customEvent("SystemMouseOver", {
      ship: ship,
      system: ship,
      element: event.target
    });
  }

  onShipMouseOut() {
    let { uiState } = this.props;
    uiState.customEvent("SystemMouseOut");
  }

  componentDidMount() {
    /*
    const element = jQuery(ReactDom.findDOMNode(this));
    element.draggable();
    */
  }

  close() {
    let { uiState } = this.props;
    uiState.closeShipWindow(this.props.ship);
  }

  render() {
    const { ship, uiState } = this.props;

    return (
      <Draggable>
        <ShipWindowContainer
          onClick={shipWindowClicked.bind(this, uiState)}
          onContextMenu={e => {
            e.preventDefault();
            e.stopPropagation();
          }}
          team={ship.team}
        >
          <Header>
            <span>{ship.name}</span> {ship.shipTypeName}
            <CloseButton onClick={this.close.bind(this)}>✕</CloseButton>
          </Header>
          <Column top>
            <ShipImage
              img={ship.imagePath}
              onMouseOver={this.onShipMouseOver.bind(this)}
              onMouseOut={this.onShipMouseOut.bind(this)}
            />
            {ship.systems.sections.getFrontSection().hasSystems() && (
              <ShipSection
                uiState={uiState}
                section={ship.systems.sections.getFrontSection()}
                ship={ship}
              />
            )}
            <ShipWindowEw ship={ship} />
          </Column>

          <Column>
            {ship.systems.sections.getStarboardSection().hasSystems() && (
              <ShipSection
                uiState={uiState}
                ship={ship}
                section={ship.systems.sections.getStarboardSection()}
              />
            )}
            {ship.systems.sections.getStarboardFrontSection().hasSystems() && (
              <ShipSection
                uiState={uiState}
                ship={ship}
                section={ship.systems.sections.getStarboardFrontSection()}
              />
            )}
            {ship.systems.sections.getPrimarySection().hasSystems() && (
              <ShipSection
                uiState={uiState}
                ship={ship}
                section={ship.systems.sections.getPrimarySection()}
              />
            )}
            {ship.systems.sections.getPortSection().hasSystems() && (
              <ShipSection
                uiState={uiState}
                ship={ship}
                section={ship.systems.sections.getPortSection()}
              />
            )}
            {ship.systems.sections.getPortFrontSection().hasSystems() && (
              <ShipSection
                uiState={uiState}
                ship={ship}
                section={ship.systems.sections.getPortFrontSection()}
              />
            )}
          </Column>
          <Column>
            {ship.systems.sections.getStarboardAftSection().hasSystems() && (
              <ShipSection
                uiState={uiState}
                ship={ship}
                section={ship.systems.sections.getStarboardAftSection()}
              />
            )}
            {ship.systems.sections.getAftSection().hasSystems() && (
              <ShipSection
                uiState={uiState}
                ship={ship}
                section={ship.systems.sections.getAftSection()}
              />
            )}
            {ship.systems.sections.getPortAftSection().hasSystems() && (
              <ShipSection
                uiState={uiState}
                ship={ship}
                section={ship.systems.sections.getPortAftSection()}
              />
            )}
          </Column>
        </ShipWindowContainer>
      </Draggable>
    );
  }
}

const shipWindowClicked = uiState => uiState.customEvent("CloseSystemInfo");

export default ShipWindow;
