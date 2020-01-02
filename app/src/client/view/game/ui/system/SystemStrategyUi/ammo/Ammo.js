import React from "react";

import {
  IconAndLabel,
  TooltipHeader,
  TooltipSubHeader,
  TooltipEntry,
  TooltipValueHeader,
  TooltipValue,
  InlineTooltipEntry,
  CenteredTooltipEntry,
  TooltipButton
} from "../../../../../../styled";
import styled from "styled-components";
import CargoItem from "../cargo/CargoItem";
import NoAmmunitionLoaded from "../../../../../../../model/unit/system/weapon/ammunition/NoAmmunitionLoaded.mjs";

const LoadingList = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
`;

const NewTargetContainer = styled.div`
  display: flex;
  align-items: center;
`;

const MagazineTooltipEntry = styled(InlineTooltipEntry)`
  justify-content: flex-start;
`;

const LoadingButton = styled(TooltipButton)`
  width: 20px;
  height: 20px;
`;

class Ammo extends React.Component {
  constructor(props) {
    super(props);

    this.state = { loadingOpen: false };
  }

  systemChangedCallback(ship, system) {
    if (
      ship.id === this.props.ship.id &&
      system.id === this.props.ammoStrategy.system.id
    ) {
      this.forceUpdate();
    }
  }

  componentDidMount() {
    const { uiState } = this.props;
    this.systemChangedCallbackInstance = this.systemChangedCallback.bind(this);
    uiState.subscribeToSystemChange(this.systemChangedCallbackInstance);
  }

  componentWillUnmount() {
    const { uiState } = this.props;
    uiState.unsubscribeFromSystemChange(this.systemChangedCallbackInstance);
  }

  unloadAmmo() {
    return () => {
      const { ship, launcher, uiState, launcherIndex } = this.props;

      launcher.unloadAmmo({ launcherIndex });
      uiState.shipSystemStateChanged(ship, launcher.system);
    };
  }

  loadTorpedo(torpedo) {
    return () => {
      const { ship, launcher, uiState, launcherIndex } = this.props;

      launcher.loadAmmo({ ammo: torpedo, launcherIndex });
      uiState.shipSystemStateChanged(ship, launcher.system);
    };
  }

  getNewLoadOutButtons() {
    const { ammoStrategy, uiState, ship } = this.props;

    const loadingTarget = ammoStrategy.getLoadingTarget();
    ammoStrategy.ammunitionClasses
      .filter(
        className =>
          !loadingTarget.find(entry => entry.object instanceof className)
      )
      .forEach(notFound => {
        loadingTarget.push({
          object: new notFound(),
          amount: 0
        });
      });

    loadingTarget.sort((a, b) => {
      if (a.object.constructor.name > b.object.constructor.name) {
        return 1;
      }

      if (a.object.constructor.name < b.object.constructor.name) {
        return -1;
      }

      return 0;
    });

    return (
      <LoadingList>
        {loadingTarget.map(({ object, amount }, i) => (
          <NewTargetContainer key={`new-loading-${i}`}>
            <LoadingButton
              img="/img/minus.png"
              onClick={() => {
                ammoStrategy.addToLoading({ object, amount: -1 });
                this.forceUpdate();
              }}
            />
            <CargoItem
              handleOnClick={this.loadTorpedo(object).bind(this)}
              key={`torpedo-launcer-${i}-possible-torpedo-${object.constructor.name}`}
              cargo={object}
              amount={amount}
            />
            <LoadingButton
              img="/img/plus.png"
              onClick={() => {
                ammoStrategy.addToLoading({ object, amount: 1 });
                this.forceUpdate();
              }}
            />
          </NewTargetContainer>
        ))}
      </LoadingList>
    );
  }

  render() {
    const { ammoStrategy, uiState, ship } = this.props;
    const { loadingOpen } = this.state;

    if (!ship.player.isUsers(uiState.services.currentUser)) {
      return null;
    }

    console.log("loading target", ammoStrategy.changeTargetLoad);

    return (
      <>
        {!loadingOpen && (
          <>
            <TooltipHeader>AMMO MAGAZINE</TooltipHeader>
            <TooltipEntry>
              <TooltipValueHeader>Ammo needed to fire</TooltipValueHeader>
              <TooltipValue>
                {ammoStrategy.getAmmoNeededForFireOrder()}
              </TooltipValue>
            </TooltipEntry>
            <MagazineTooltipEntry>
              <TooltipEntry>
                <TooltipValueHeader>Current ammo: </TooltipValueHeader>
                <TooltipValue>
                  {ammoStrategy.getSelectedAmmo().getShortDisplayName()}
                </TooltipValue>
              </TooltipEntry>
            </MagazineTooltipEntry>
            <MagazineTooltipEntry>
              <TooltipEntry>
                <TooltipValueHeader>Ammo in magazine: </TooltipValueHeader>
              </TooltipEntry>

              {ammoStrategy.getAmmoInMagazine().map(({ object, amount }, i) => (
                <CargoItem
                  handleOnClick={this.loadTorpedo(object).bind(this)}
                  key={`torpedo-launcer-${i}-possible-torpedo-${object.constructor.name}`}
                  cargo={object}
                  amount={amount}
                />
              ))}
            </MagazineTooltipEntry>

            <TooltipEntry>
              <TooltipValue>NOTE: Magazine reloaded only offline</TooltipValue>
            </TooltipEntry>

            <CenteredTooltipEntry
              clickable
              onClick={() => this.setState({ loadingOpen: true })}
            >
              <TooltipValueHeader>CLICK TO LOAD NEW AMMO</TooltipValueHeader>
            </CenteredTooltipEntry>
          </>
        )}

        {loadingOpen && (
          <>
            <TooltipHeader>New loadout</TooltipHeader>
            <TooltipEntry>
              <TooltipValue>NOTE: Magazine reloaded only offline</TooltipValue>
            </TooltipEntry>
            <TooltipEntry>
              <TooltipValueHeader>Cooldown before loading:</TooltipValueHeader>
              <TooltipValue>
                {ammoStrategy.startLoadingAfter} turn(s)
              </TooltipValue>
            </TooltipEntry>
            <TooltipEntry>
              <TooltipValueHeader>Turns offline:</TooltipValueHeader>
              <TooltipValue>{ammoStrategy.turnsOffline} turn(s)</TooltipValue>
            </TooltipEntry>
            <TooltipEntry>
              <TooltipValueHeader>Ammo transfer per turn:</TooltipValueHeader>
              <TooltipValue>{ammoStrategy.intakeInTurn}</TooltipValue>
            </TooltipEntry>
            <TooltipEntry>
              <TooltipValueHeader>Magazine capacity:</TooltipValueHeader>
              <TooltipValue>
                {`${ammoStrategy.getLoadingTargetAmount()}/${
                  ammoStrategy.capacity
                }`}
              </TooltipValue>
            </TooltipEntry>

            {this.getNewLoadOutButtons()}
            <CenteredTooltipEntry
              clickable
              onClick={() => this.setState({ loadingOpen: false })}
            >
              <TooltipValueHeader>CLOSE</TooltipValueHeader>
            </CenteredTooltipEntry>
            <CenteredTooltipEntry
              clickable
              onClick={() => {
                ship.systems
                  .getSystems()
                  .filter(
                    system =>
                      system.constructor === ammoStrategy.system.constructor
                  )
                  .forEach(system =>
                    system.callHandler(
                      "setNewLoadingTarget",
                      ammoStrategy.getLoadingTarget()
                    )
                  );
                this.setState({ loadingOpen: false });
              }}
            >
              <TooltipValueHeader>COPY FOR ALL WEAPONS</TooltipValueHeader>
            </CenteredTooltipEntry>
          </>
        )}
      </>
    );
  }
}

export default Ammo;
