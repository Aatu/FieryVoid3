import * as React from "react";
import styled from "styled-components";
import SystemIcon from "../system/SystemIcon";

const Container = styled.div`
  display: flex;
`;

class WeaponTargeting extends React.Component {
  render() {
    const { uiState, ship, target, system, ...rest } = this.props;
    const { weaponFireService } = uiState.services;

    if (!weaponFireService.canFire(ship, target, system)) {
      return null;
    }

    const hitChange = system.callHandler("getHitChange", {
      shooter: ship,
      target
    });

    return (
      <Container>
        <SystemIcon
          targeting
          uiState={uiState}
          key={`system-weaponTargeting-${ship.id}-${system.id}`}
          system={system}
          ship={ship}
          selected={false}
          weaponTargeting={{
            target: target,
            hitChange: hitChange
          }}
          text={hitChange.result + "%"}
          {...rest}
        />
      </Container>
    );
  }
}

export default WeaponTargeting;
