class Faction {
  public name: string;
  public ships: string[];

  constructor(name: string, ships: string[]) {
    this.name = name;
    this.ships = ships;
  }
}

export default [
  new Faction("United Colonies", ["UcRhino", "Haka"]),
  new Faction("The Expanse Protecorate", ["Caliope", "Fulcrum", "Mouros"]),
  new Faction("Federation Navy", ["Impetous"]),
];