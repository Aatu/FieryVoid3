import hexagon from "../hexagon";

class GameSlot {
  constructor(data = {}) {
    this.deserialize(data);
  }

  serialize() {
    return {
      id: this.id,
      userId: this.userId,
      deploymentLocation: this.deploymentLocation,
      deploymentRadius: this.deploymentRadius,
      shipIds: this.shipIds
    };
  }

  deserialize(data = {}) {
    this.id = data.id;
    this.userId = data.userId || null;
    this.deploymentLocation = data.deploymentLocation || hexagon.Offset(0, 0);
    this.deploymentRadius = data.deploymentRadius || 0;
    this.shipIds = data.shipIds || [];

    return this;
  }
}

export default GameSlot;
