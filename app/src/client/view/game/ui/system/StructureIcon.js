import * as React from "react";
import styled from "styled-components";
import SystemInfo from "./SystemInfo";

import { colors } from "../../../../styled";

const HealthBar = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 7px;
  border: 2px solid black;
  box-sizing: border-box;

  background-color: #7a2020;

  :before {
    content: "";
    position: absolute;
    width: ${props => `${props.health}%`};
    height: 100%;
    left: 0;
    bottom: 0;
    background-color: ${props => (props.criticals ? "#ed6738" : "#427231")};
  }
`;

const SystemText = styled.div`
  position: absolute;
  top: 0px;
  width: 100%;
  height: calc(100% - 5px);
  font-family: arial;
  font-size: 10px;
  color: white;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  text-shadow: black 0 0 6px, black 0 0 6px, black 0 0 6px, black 0 0 6px;
`;

const System = styled.div`
  position: relative;
  box-sizing: border-box;
  width: 30px;
  height: 30px;

  background-color: "transparent";
  background-image: ${props => `url(${props.background})`};
  background-size: cover;
  filter: ${props => {
    if (props.targeting) {
      return "hue-rotate(0deg) brightness(4) grayscale(0)";
    } else if (props.reserved) {
      return "hue-rotate(0deg) brightness(1) grayscale(0.7)";
    } else if (props.firing) {
      return "hue-rotate(0deg) brightness(4) grayscale(0)"; //"grayscale(100%) brightness(6) drop-shadow(0px 0px 5px white)";
    } else if (props.destroyed) {
      return "blur(1px)";
    } else {
      return "none";
    }
  }};
  cursor: pointer;

  ${SystemText} {
    display: ${props => (props.offline ? "none" : "flex")};
  }

  :before {
    content: "";
    position: absolute;
    width: 100%;
    height: 100%;
    opacity: ${props => {
      if (props.destroyed || props.offline || props.loading) {
        return "0.5";
      }

      return "0";
    }};

    background-color: ${props => {
      if (props.destroyed || props.offline) {
        return "black";
      } else if (props.loading) {
        return "orange";
      }

      return "transparent";
    }};

    background-image: ${props => {
      if (props.offline) {
        return "url(/img/offline.png)";
      }

      return "none";
    }};
  }
`;

const Container = styled.div`
  cursor: pointer;
  position: relative;
  margin: 3px 1px;
`;

const StructureText = styled.div`
  z-index: 1;
`;

const StructureContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  width: calc(100% - 4px);
  height: 16px;
  background-color: #081313;
  color: ${props => (props.health === 0 ? "transparent" : "white")};
  font-family: arial;
  font-size: 11px;
  text-shadow: black 0 0 6px, black 0 0 6px;
  margin: 1px;
  filter: ${props => (props.health === 0 ? "blur(1px)" : "none")};
  border: 1px solid black;

  :before {
    box-sizing: border-box;
    content: "";
    position: absolute;
    width: ${props => `${props.health}%`};
    height: 100%;
    left: 0;
    bottom: 0;
    z-index: 0;
    background-color: ${props => (props.criticals ? "#ed6738" : "#427231")};
  }
`;

class StructureIcon extends React.Component {
  constructor(props) {
    super(props);

    this.element = React.createRef();
    this.state = {
      mouseOveredSystem: null,
      clickedSystem: null
    };
  }

  clickSystem(event) {
    event.stopPropagation();
    event.preventDefault();

    const { uiState, system, ship } = this.props;

    uiState.customEvent("systemClicked", {
      ship,
      system,
      element: this.element,
      scs: true
    });
  }

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

  onContextMenu(e) {
    e.stopPropagation();
    e.preventDefault();

    let { uiState, system, ship } = this.props;

    uiState.customEvent("systemRightClicked", { system, ship });
  }

  render() {
    let {
      uiState,
      system,
      ship,
      scs,
      destroyed,
      systemMenu: {
        systemInfoMenuProvider,
        activeSystem,
        activeSystemElement
      } = {
        systemInfoMenuProvider: null,
        activeSystem: null,
        activeSystemElement: null
      },
      onSystemClicked = this.clickSystem,
      selected = false,
      text = null,
      target = null,
      ...rest
    } = this.props;
    const { mouseOveredSystem } = this.state;

    const menu = activeSystem ? systemInfoMenuProvider : null;

    const displayMenu = Boolean(
      (!activeSystem && mouseOveredSystem) ||
        (activeSystem &&
          activeSystem === system &&
          activeSystemElement === this.element)
    );

    return (
      <>
        {displayMenu && (
          <SystemInfo
            scs
            uiState={uiState}
            ship={ship}
            system={system}
            systemInfoMenuProvider={menu}
            element={mouseOveredSystem || activeSystemElement}
            target={target}
            {...rest}
          />
        )}
        <StructureContainer
          ref={c => (this.element = c)}
          onClick={onSystemClicked.bind(this)}
          onMouseOver={this.onSystemMouseOver.bind(this)}
          onMouseOut={this.onSystemMouseOut.bind(this)}
          onContextMenu={this.onContextMenu.bind(this)}
          health={getStructureLeft(system)}
          criticals={system.hasAnyCritical()}
        >
          <StructureText>
            {system.getRemainingHitpoints()} / {system.hitpoints} A{" "}
            {system.getArmor()}
          </StructureText>
        </StructureContainer>
      </>
    );
  }
}

const getStructureLeft = system =>
  ((system.hitpoints - system.getTotalDamage()) / system.hitpoints) * 100;

export default StructureIcon;
