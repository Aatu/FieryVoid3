import * as THREE from "three";

const COLOR_OEW_FRIENDLY = new THREE.Color(160 / 255, 250 / 255, 100 / 255);
const COLOR_OEW_ENEMY = new THREE.Color(255 / 255, 40 / 255, 40 / 255);
const COLOR_OEW_DIST = new THREE.Color(255 / 255, 157 / 255, 0 / 255);
const COLOR_SDEW = new THREE.Color(109 / 255, 189 / 255, 255 / 255);
const COLOR_OEW_SOEW = new THREE.Color(1, 1, 1);

class EWIconContainer {
  constructor(scene, iconContainer) {
    this.ewIcons = [];
    this.scene = scene;
    this.zoomScale = 1;
    this.shipIconContainer = iconContainer;
  }

  consumeGamedata(gamedata) {
    this.ewIcons.forEach(function(ewIcon) {
      ewIcon.used = false;
    });

    gamedata.ships.forEach(ship => {
      gamedata.ships.forEach(target => {
        this.createOrUpdateOEW(ship, target, ew.getOffensiveEW(ship, target));
        this.createOrUpdateOEW(
          ship,
          target,
          ew.getOffensiveEW(ship, target, "DIST"),
          "DIST"
        );
        this.createOrUpdateOEW(
          ship,
          target,
          ew.getOffensiveEW(ship, target, "SDEW"),
          "SDEW"
        );
        this.createOrUpdateOEW(
          ship,
          target,
          ew.getOffensiveEW(ship, target, "SOEW"),
          "SOEW"
        );
      });
    });

    this.ewIcons = this.ewIcons.filter(icon => {
      if (!icon.used) {
        this.scene.remove(icon.sprite.mesh);
        icon.sprite.destroy();
        return false;
      }

      return true;
    });
  }

  updateForShip(ship) {
    var length = this.ewIcons.length;

    this.ewIcons.forEach(function(ewIcon) {
      if (ewIcon.shipId === ship.id) {
        ewIcon.used = false;
      }
    });

    gamedata.ships.forEach(function(target) {
      this.createOrUpdateOEW(ship, target, ew.getOffensiveEW(ship, target));
      this.createOrUpdateOEW(
        ship,
        target,
        ew.getOffensiveEW(ship, target, "DIST"),
        "DIST"
      );
      this.createOrUpdateOEW(
        ship,
        target,
        ew.getOffensiveEW(ship, target, "SDEW"),
        "SDEW"
      );
      this.createOrUpdateOEW(
        ship,
        target,
        ew.getOffensiveEW(ship, target, "SOEW"),
        "SOEW"
      );
    });

    this.ewIcons = this.ewIcons.filter(function(icon) {
      if (!icon.used && icon.shipId === ship.id) {
        this.scene.remove(icon.sprite.mesh);
        icon.sprite.destroy();
        return false;
      }

      return true;
    }, this);

    if (this.ewIcons.length > length) {
      this.showForShip(ship);
    }
  }

  hide() {
    this.ewIcons.forEach(function(icon) {
      icon.sprite.hide();
    });
  }

  showForShip(ship) {
    this.ewIcons
      .filter(function(icon) {
        return icon.shipId === ship.id || icon.targetId === ship.id;
      })
      .forEach(function(icon) {
        icon.sprite.update(
          { ...icon.shipIcon.getPosition(), z: icon.shipIcon.shipZ },
          { ...icon.targetIcon.getPosition(), z: icon.targetIcon.shipZ }
        );
        icon.sprite.show();
      }, this);
  }

  showByShip(ship) {
    this.ewIcons
      .filter(function(icon) {
        return icon.shipId === ship.id;
      })
      .forEach(function(icon) {
        icon.sprite.update(
          { ...icon.shipIcon.getPosition(), z: icon.shipIcon.shipZ },
          { ...icon.targetIcon.getPosition(), z: icon.targetIcon.shipZ }
        );
        icon.sprite.show();
      }, this);
  }

  onEvent(name, payload) {
    var target = this["on" + name];
    if (target && typeof target == "function") {
      target.call(this, payload);
    }
  }

  onZoomEvent(payload) {
    var zoom = payload.zoom;
    if (zoom <= 0.5) {
      this.zoomScale = 2 * zoom;
      this.ewIcons.forEach(function(icon) {
        icon.sprite.setLineWidth(this.getOEWLineWidth(icon.amount));
      }, this);
    } else {
      this.zoomScale = 1;
    }
  }

  createOrUpdateOEW(ship, target, amount, type) {
    if (amount === 0) {
      return;
    }

    var icon = this.getOEWIcon(ship, target, type);
    if (icon) {
      this.updateOEWIcon(icon, ship, target, amount, type);
    } else {
      this.ewIcons.push(
        this.createOEWIcon(ship, target, amount, this.scene, type)
      );
    }
  }

  updateOEWIcon(icon, ship, target, amount) {
    var shipIcon = this.shipIconContainer.getByShip(ship);
    var targetIcon = this.shipIconContainer.getByShip(target);

    icon.sprite.setLineWidth(this.getOEWLineWidth(amount));
    icon.sprite.update(
      { ...shipIcon.getPosition(), z: 1 },
      { ...targetIcon.getPosition(), z: 1 }
    );
    icon.shipIcon = shipIcon;
    icon.targetIcon = targetIcon;
    icon.amount = amount;
    icon.used = true;
  }

  createOEWIcon(ship, target, amount, scene, type) {
    type = type || "OEW";

    var shipIcon = this.shipIconContainer.getByShip(ship);
    var targetIcon = this.shipIconContainer.getByShip(target);

    var OEWIcon = {
      type: type,
      shipId: ship.id,
      targetId: target.id,
      amount: amount,
      shipIcon: shipIcon,
      targetIcon: targetIcon,
      sprite: new window.LineSprite(
        { ...shipIcon.getPosition(), z: shipIcon.shipZ },
        { ...targetIcon.getPosition(), z: targetIcon.shipZ },
        this.getOEWLineWidth(amount),
        this.getColor(ship, type),
        0.5
      ),
      used: true
    };

    OEWIcon.sprite.hide();
    scene.add(OEWIcon.sprite.mesh);

    return OEWIcon;
  }

  getColor(ship, type) {
    switch (type) {
      case "OEW":
        return gamedata.isMyOrTeamOneShip(ship)
          ? COLOR_OEW_FRIENDLY
          : COLOR_OEW_ENEMY;
      case "DIST":
        return COLOR_OEW_DIST;
      case "SDEW":
        return COLOR_SDEW;
      case "SOEW":
        return COLOR_OEW_SOEW;
    }
  }

  getOEWLineWidth(amount) {
    return this.zoomScale * amount;
  }

  getOEWIcon(ship, target, type) {
    type = type || "OEW";

    return this.ewIcons.find(function(icon) {
      return (
        icon.type === type &&
        icon.shipId === ship.id &&
        icon.targetId === target.id
      );
    });
  }
}

export default EWIconContainer;
