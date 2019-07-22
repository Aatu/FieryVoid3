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

  background-color: black;

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
  width: 100%;
  height: calc(100% - 5px);
  color: white;
  font-family: arial;
  font-size: 10px;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  text-shadow: black 0 0 6px, black 0 0 6px;
`;

const System = styled.div`
  position: relative;
  box-sizing: border-box;
  width: 30px;
  height: 30px;
  margin: 3px 1px;

  background-color: ${props => {
    if (props.firing) {
      return "#e06f01";
    } else {
      return "transparent";
    }
  }};
  box-shadow: ${props => {
    if (props.firing) {
      return "box-shadow: 0px 0px 15px #eb5c15";
    } else {
      return "none";
    }
  }};
  background-image: ${props => `url(${props.background})`};
  background-size: cover;
  filter: ${props => {
    if (props.selected && !props.scs) {
      return "grayscale(100%) brightness(6) drop-shadow(0px 0px 5px white)";
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
  position: relative;
`;

class SystemIcon extends React.Component {
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

    const { uiState, system, ship, scs } = this.props;

    uiState.customEvent("systemClicked", {
      ship,
      system,
      element: this.element,
      scs
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
      ...rest
    } = this.props;
    const { mouseOveredSystem } = this.state;

    if (getDestroyed(ship, system) || destroyed) {
      return (
        <System background={getBackgroundImage(system)} destroyed>
          <HealthBar health="0" />
        </System>
      );
    }

    const menu = activeSystem ? systemInfoMenuProvider : null;

    const displayMenu = Boolean(
      (!activeSystem && mouseOveredSystem) ||
        (activeSystem &&
          activeSystem === system &&
          activeSystemElement === this.element)
    );

    return (
      <Container>
        {displayMenu && (
          <SystemInfo
            uiState={uiState}
            ship={ship}
            system={system}
            systemInfoMenuProvider={menu}
            element={mouseOveredSystem || activeSystemElement}
            {...rest}
          />
        )}
        <System
          ref={c => (this.element = c)}
          scs={scs}
          onClick={this.clickSystem.bind(this)}
          onMouseOver={this.onSystemMouseOver.bind(this)}
          onMouseOut={this.onSystemMouseOut.bind(this)}
          onContextMenu={this.onContextMenu.bind(this)}
          background={getBackgroundImage(system)}
          offline={isOffline(ship, system)}
          loading={isLoading(system)}
          selected={uiState.isSelectedSystem(system)}
          firing={isFiring(ship, system)}
        >
          <SystemText>{system.getIconText()}</SystemText>
          <HealthBar health={getStructureLeft(system)} />
        </System>
      </Container>
    );
  }
}

const isFiring = (ship, system) => false; //ASK FROM SHIP weaponManager.hasFiringOrder(ship, system);

const isLoading = system => undefined; //ASK FROM SYSTEM system.weapon && !weaponManager.isLoaded(system);

const isOffline = (ship, system) => system.power.isOffline();

const getStructureLeft = system =>
  ((system.hitpoints - system.getTotalDamage()) / system.hitpoints) * 100;

const getDestroyed = (ship, system) => system.isDestroyed();

const getBackgroundImage = system => system.getBackgroundImage();

const hasCriticals = system => system.hasAnyCritical();

export default SystemIcon;
