import hexagon from "../hexagon";

class GameSlot {
  constructor(data = {}) {
    this.deserialize(data);
  }

  validate() {
    if (!this.name) {
      return "Slot needs to have a name";
    }

    if (!(this.deploymentLocation instanceof hexagon.Offset)) {
      return "Slot needs to have deploymentlocation of type hexagon.Offset";
    }

    if (
      this.deploymentRadius !== parseInt(this.deploymentRadius, 10) ||
      this.deploymentRadius < 0
    ) {
      return "Slot needs to have greater than zero deploymentRadius";
    }

    if (this.team !== parseInt(this.team, 10) || this.team < 0) {
      return "Slot needs to have greater than zero numeric team";
    }

    if (!(this.deploymentVector instanceof hexagon.Offset)) {
      return "Slot needs to have deploymentVector of type hexagon.Offset";
    }

    if (this.points <= 0) {
      return "Slot needs to have points more than 0";
    }
  }

  serialize() {
    return {
      id: this.id,
      name: this.name,
      userId: this.userId,
      deploymentLocation: this.deploymentLocation,
      deploymentRadius: this.deploymentRadius,
      deploymentVector: this.deploymentVector,
      points: this.points,
      shipIds: this.shipIds,
      team: this.team
    };
  }

  deserialize(data = {}) {
    this.id = data.id;
    this.name = data.name;
    this.userId = data.userId || null;
    this.deploymentLocation =
      data.deploymentLocation || new hexagon.Offset(0, 0);
    this.deploymentVector = data.deploymentVector || new hexagon.Offset(0, 0);
    this.deploymentRadius = data.deploymentRadius || 10;
    this.shipIds = data.shipIds || [];
    this.points = data.points || 0;
    this.team = data.team || 1;

    return this;
  }
}

export default GameSlot;
