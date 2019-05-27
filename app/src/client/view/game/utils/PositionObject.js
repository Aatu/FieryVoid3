class PositionObject {
  constructor(view, game, hex, entity = null) {
    this.view = view;
    this.game = game;
    this.hex = hex;
    this.entity = entity;
  }
}

export default PositionObject;
