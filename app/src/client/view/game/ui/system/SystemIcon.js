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
  width: ${props => (props.scs ? "30px" : "34px")};
  height: ${props => (props.scs ? "30px" : "34px")};
  margin: ${props => (props.scs ? "3px 1px" : "2px")};

  border: ${props => !props.scs && `1px solid ${colors.systemBorder}`};

  background-color: ${props => {
    if (props.selected) {
      return "#4e6c91";
    } else if (props.firing) {
      return "#e06f01";
    } else {
      return "black";
    }
  }};
  box-shadow: ${props => {
    if (props.selected) {
      return "0px 0px 15px #0099ff";
    } else if (props.firing) {
      return "box-shadow: 0px 0px 15px #eb5c15";
    } else {
      return "none";
    }
  }};
  background-image: ${props => `url(${props.background})`};
  background-size: cover;
  filter: ${props => (props.destroyed ? "blur(1px)" : "none")};
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
        return "url(./img/offline.png)";
      }

      return "none";
    }};
  }
`;

class SystemIcon extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      mouseOveredSystem: null
    };
  }

  clickSystem(e) {
    e.stopPropagation();
    e.preventDefault();

    const { uiState, system, ship } = this.props;

    uiState.customEvent("SystemClicked", {
      ship,
      system,
      element: e.target
    });
  }

  onSystemMouseOver(event) {
    event.stopPropagation();
    event.preventDefault();

    let { uiState, system, ship } = this.props;

    uiState.customEvent("SystemMouseOver", {
      ship,
      system,
      element: event.target
    });

    this.setState({ mouseOveredSystem: event.target });
  }

  onSystemMouseOut(event) {
    event.stopPropagation();
    event.preventDefault();

    let { uiState } = this.props;

    uiState.customEvent("SystemMouseOut");

    this.setState({ mouseOveredSystem: null });
  }

  onContextMenu(e) {
    e.stopPropagation();
    e.preventDefault();

    let { uiState, system, ship } = this.props;

    uiState.customEvent("SystemRightClicked", { system, ship });
  }

  render() {
    let { uiState, system, ship, scs, destroyed } = this.props;
    const { mouseOveredSystem } = this.state;

    if (getDestroyed(ship, system) || destroyed) {
      return (
        <System background={getBackgroundImage(system)} destroyed>
          <HealthBar health="0" />
        </System>
      );
    }

    return (
      <System
        scs={scs}
        onClick={this.clickSystem.bind(this)}
        onMouseOver={this.onSystemMouseOver.bind(this)}
        onMouseOut={this.onSystemMouseOut.bind(this)}
        onContextMenu={this.onContextMenu.bind(this)}
        background={getBackgroundImage(system)}
        offline={isOffline(ship, system)}
        loading={isLoading(system)}
        selected={isSelected(system, uiState)}
        firing={isFiring(ship, system)}
      >
        <SystemText>{system.getIconText()}</SystemText>
        <HealthBar health={getStructureLeft(system)} />
        {mouseOveredSystem && (
          <SystemInfo ship={ship} system={system} element={mouseOveredSystem} />
        )}
      </System>
    );
  }
}

const isFiring = (ship, system) => false; //ASK FROM SHIP weaponManager.hasFiringOrder(ship, system);

const isLoading = system => false; //ASK FROM SYSTEM system.weapon && !weaponManager.isLoaded(system);

const isOffline = (ship, system) => system.power.isOffline();

const getStructureLeft = system =>
  ((system.hitpoints - system.getTotalDamage()) / system.hitpoints) * 100;

const getDestroyed = (ship, system) => system.isDestroyed();

const getBackgroundImage = system => system.getBackgroundImage();

const hasCriticals = system => system.hasAnyCritical();

const isSelected = (system, uiState) => uiState.isSelectedSystem(system);

export default SystemIcon;
