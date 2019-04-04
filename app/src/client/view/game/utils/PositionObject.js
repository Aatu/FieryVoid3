class PositionObject {
  constructor(view, game, hex, entities = []) {
    this.view = view;
    this.game = game;
    this.hex = hex;
    this.entities = entities;
  }
}

export default PositionObject;
