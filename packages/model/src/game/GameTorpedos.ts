import TorpedoFlight, { SerializedTorpedoFlight } from "../unit/TorpedoFlight";

export type SerializedGameTorpedos = {
  flights: SerializedTorpedoFlight[];
};

class GameTorpedos {
  public flights: TorpedoFlight[];

  constructor() {
    this.flights = [];
  }

  getTorpedoFlightById(id: string) {
    return this.flights.find((flight) => flight.id === id);
  }

  addTorpedoFlights(flights: TorpedoFlight | TorpedoFlight[]) {
    flights = ([] as TorpedoFlight[]).concat(flights);

    this.flights = [...this.flights, ...flights];
  }

  getTorpedoFlights() {
    return [...this.flights];
  }

  serialize(): SerializedGameTorpedos {
    return {
      flights: this.flights.map((flight) => flight.serialize()),
    };
  }

  deserialize(data: SerializedGameTorpedos = { flights: [] }) {
    this.flights = data.flights.map((flight) => TorpedoFlight.fromData(flight));

    return this;
  }

  advanceTurn() {
    this.flights = this.flights.filter((flight) => !flight.isDone());
  }
}

export default GameTorpedos;
