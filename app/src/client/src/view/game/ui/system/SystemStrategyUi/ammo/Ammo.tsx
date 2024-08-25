import React, { useEffect } from "react";

import {
  TooltipHeader,
  TooltipEntry,
  TooltipValueHeader,
  TooltipValue,
  InlineTooltipEntry,
  CenteredTooltipEntry,
  TooltipButton,
} from "../../../../../../styled";
import styled from "styled-components";
import CargoItem from "../cargo/CargoItem";
import { useForceRerender } from "../../../../../../util/useForceRerender";
import ShipSystem from "@fieryvoid3/model/src/unit/system/ShipSystem";
import Ship from "@fieryvoid3/model/src/unit/Ship";
import AmmunitionStrategy from "@fieryvoid3/model/src/unit/system/strategy/weapon/AmmunitionStrategy";
import { createAmmoInstance } from "@fieryvoid3/model/src/unit/system/weapon/ammunition";
import { SYSTEM_HANDLERS } from "@fieryvoid3/model/src/unit/system/strategy/types/SystemHandlersTypes";
import { useUiStateHandler } from "../../../../../../state/useUIStateHandler";

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

type LoadoutButtonsProps = {
  ammoStrategy: AmmunitionStrategy;
};

const LoadoutButtons: React.FC<LoadoutButtonsProps> = ({ ammoStrategy }) => {
  const rerender = useForceRerender();

  const loadingTarget = ammoStrategy.getLoadingTarget();
  ammoStrategy.ammunitionClasses
    .filter(
      (className) =>
        !loadingTarget.find(
          (entry) => entry.object.getCargoClassName() === className
        )
    )
    .forEach((notFound) => {
      loadingTarget.push({
        object: createAmmoInstance(notFound),
        amount: 0,
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
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();

              ammoStrategy.addToLoading({ object, amount: -1 });
              rerender();
            }}
          />
          <CargoItem
            key={`torpedo-launcer-${i}-possible-torpedo-${object.constructor.name}`}
            cargo={object}
            amount={amount}
          />
          <LoadingButton
            img="/img/plus.png"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();

              ammoStrategy.addToLoading({ object, amount: 1 });
              rerender();
            }}
          />
        </NewTargetContainer>
      ))}
    </LoadingList>
  );
};

export type AmmoProps = {
  ammoStrategy: AmmunitionStrategy;
  ship: Ship;
};

const Ammo: React.FC<AmmoProps> = ({ ship, ammoStrategy }) => {
  const uiState = useUiStateHandler();
  const [loadingOpen, setLoadingOpen] = React.useState<boolean>(false);
  const rerender = useForceRerender();

  useEffect(() => {
    const systemChangedCallback = (newShip: Ship, system: ShipSystem) => {
      if (newShip.id === ship.id && system.id === ammoStrategy.getSystem().id) {
        rerender();
      }
    };

    uiState.subscribeToSystemChange(systemChangedCallback);

    return () => {
      uiState.unsubscribeFromSystemChange(systemChangedCallback);
    };
  }, []);

  if (!ship.player.isUsers(uiState.getServices().currentUser)) {
    return null;
  }

  return (
    <>
      {!loadingOpen && (
        <>
          <TooltipHeader>AMMO MAGAZINE</TooltipHeader>
          <TooltipEntry>
            <TooltipValueHeader>Ammo needed to fire</TooltipValueHeader>
            <TooltipValue>{ammoStrategy.ammoPerFireOrder}</TooltipValue>
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
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setLoadingOpen(true);
            }}
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

          <LoadoutButtons ammoStrategy={ammoStrategy} />
          <CenteredTooltipEntry
            clickable
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setLoadingOpen(false);
            }}
          >
            <TooltipValueHeader>CLOSE</TooltipValueHeader>
          </CenteredTooltipEntry>
          <CenteredTooltipEntry
            clickable
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();

              ship.systems
                .getSystems()
                .filter(
                  (system) =>
                    system.constructor === ammoStrategy.getSystem().constructor
                )
                .forEach((system) =>
                  system.callHandler(
                    SYSTEM_HANDLERS.setNewLoadingTarget,
                    ammoStrategy.getLoadingTarget(),
                    undefined
                  )
                );
              setLoadingOpen(false);
            }}
          >
            <TooltipValueHeader>COPY FOR ALL WEAPONS</TooltipValueHeader>
          </CenteredTooltipEntry>
        </>
      )}
    </>
  );
};

export default Ammo;
